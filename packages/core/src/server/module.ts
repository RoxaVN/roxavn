import { Request, Response, Router, NextFunction } from 'express';
import { QueryRunner } from 'typeorm';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  FullApiResponse,
} from '../base';
import { databaseManager } from './database';
import {
  ApiMiddleware,
  authorizationManager,
  authorizationMiddleware,
  ErrorMiddleware,
  MiddlewareContext,
  serverErrorMiddleware,
  validatorMiddleware,
} from './middlewares';
import { ApiService } from './service';

export class ServerModule extends BaseModule {
  static apiRouter = Router();
  static apiMiddlewares = [] as Array<ApiMiddleware>;
  static validatorMiddleware = validatorMiddleware;
  static authorizationMiddleware = authorizationMiddleware;
  static authenticatorMiddleware: ApiMiddleware = () => {
    throw new Error('authenticatorMiddleware not implemented');
  };

  static errorMiddlewares = [serverErrorMiddleware] as Array<ErrorMiddleware>;

  readonly entities: any[] = [];

  useRawApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>,
    handler: (req: Req, context: MiddlewareContext) => Promise<Resp> | Resp
  ) {
    ServerModule.apiRouter[api.method](
      api.path,
      async function (req: Request, resp: Response, next: NextFunction) {
        const queryRunner = databaseManager.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        resp.locals.$queryRunner = queryRunner;

        let error;
        for (const middleware of [
          ServerModule.validatorMiddleware,
          ServerModule.authenticatorMiddleware,
          ServerModule.authorizationMiddleware,
          ...ServerModule.apiMiddlewares,
        ]) {
          try {
            await middleware(api, {
              req,
              resp,
              dbSession: resp.locals.$queryRunner.manager,
            });
          } catch (e) {
            console.error(e);
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            error = e;
            break;
          }
        }
        next(error);
      },
      async function (req: Request, resp: Response, next: NextFunction) {
        const queryRunner: QueryRunner = resp.locals.$queryRunner;
        let error;
        try {
          const result = await handler(resp.locals as Req, {
            req,
            resp,
            dbSession: queryRunner.manager,
          });
          await queryRunner.commitTransaction();
          resp.status(200).json({ code: 200, data: result } as FullApiResponse);
        } catch (e) {
          console.error(e);
          await queryRunner.rollbackTransaction();
          error = e;
        } finally {
          await queryRunner.release();
        }
        if (error) {
          next(error);
        }
      }
    );
  }

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (
      serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>
    ) => {
      this.useRawApi(api, async (req, context) => {
        return this.createService(serviceClass, context).handle(req);
      });

      if ('auth' in serviceClass.prototype) {
        authorizationManager.customs[api.path] = (api, context) => {
          const service: any = this.createService(serviceClass, context);
          return service.auth(context.resp.locals as any);
        };
      }
    };
  }

  createService<Req extends ApiRequest, Resp extends ApiResponse>(
    serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>,
    context: MiddlewareContext
  ) {
    return new serviceClass(context.dbSession);
  }

  static fromBase(
    base: BaseModule,
    options?: { entities?: Record<string, any> }
  ) {
    const module = new ServerModule(base.name, base.options);
    if (options?.entities) {
      module.entities.push(...Object.values(options.entities));
    }
    return module;
  }
}

export const serverModule = ServerModule.fromBase(baseModule);
