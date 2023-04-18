import { json } from '@remix-run/node';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  ServerException,
} from '../base';
import { databaseManager } from './database';
import {
  ServerMiddleware,
  authorizationMiddleware,
  ServerLoaderArgs,
  validatorMiddleware,
  ServerLoaderContext,
} from './middlewares';
import { ApiService } from './service';

export class ServerModule extends BaseModule {
  static apiRoutes: Array<{
    api: Api;
    handler: (
      request: Request,
      context: ServerLoaderContext
    ) => Promise<Response>;
  }> = [];
  static apiMiddlewares: Array<ServerMiddleware> = [];
  static validatorMiddleware = validatorMiddleware;
  static authorizationMiddleware = authorizationMiddleware;
  static authenticatorMiddleware: ServerMiddleware = () => {
    throw new Error('authenticatorMiddleware not implemented');
  };

  readonly entities: any[] = [];

  useRawApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>,
    handler: (requestData: Req, args: ServerLoaderArgs) => Promise<Resp>
  ) {
    ServerModule.apiRoutes.push({
      api: api,
      handler: async (request, context) => {
        const queryRunner = databaseManager.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const middlewares = [
          ServerModule.validatorMiddleware,
          ServerModule.authenticatorMiddleware,
          ServerModule.authorizationMiddleware,
          ...ServerModule.apiMiddlewares,
        ];
        try {
          const args = {
            api,
            request,
            context,
            state: {},
            dbSession: queryRunner.manager,
          };
          for (const middleware of middlewares) {
            await middleware(args);
          }
          const result = await handler(args.state as Req, args);
          await queryRunner.commitTransaction();
          return json({ code: 200, data: result });
        } catch (e) {
          await queryRunner.rollbackTransaction();
          throw e;
        } finally {
          await queryRunner.release();
        }
      },
    });
  }

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (
      serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>
    ) => {
      this.useRawApi(api, async (requestData, args) => {
        return this.createService(serviceClass, args).handle(requestData);
      });
    };
  }

  createService<Req extends ApiRequest, Resp extends ApiResponse>(
    serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>,
    args: ServerLoaderArgs
  ) {
    return new serviceClass(args.dbSession);
  }

  static handleError(error: any) {
    console.error(error);
    if (!error.code || !error.toJson) {
      error = new ServerException();
    }
    return json(
      { code: error.code, error: error.toJson() },
      { status: error.code }
    );
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
