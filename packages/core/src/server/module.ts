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
  MiddlewareContext,
  validatorMiddleware,
  IRequest,
  IResponse,
} from './middlewares';
import { ApiService } from './service';

export class ServerModule extends BaseModule {
  static apiRoutes: Array<{
    api: Api;
    handler: (request: IRequest, response: IResponse) => Promise<void>;
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
    handler: (
      requestData: Req,
      context: MiddlewareContext
    ) => Promise<Resp> | Resp
  ) {
    ServerModule.apiRoutes.push({
      api: api,
      handler: async (request, response) => {
        const queryRunner = databaseManager.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const middlewares = [
          ServerModule.validatorMiddleware,
          ServerModule.authenticatorMiddleware,
          ServerModule.authorizationMiddleware,
          ...ServerModule.apiMiddlewares,
        ];
        const state = {};
        try {
          const context = {
            request,
            response,
            dbSession: queryRunner.manager,
            state,
          };
          for (const middleware of middlewares) {
            await middleware(context);
          }
          const result = await handler(context.state as Req, context);
          await queryRunner.commitTransaction();
          response.status(200).send({ code: 200, data: result });
        } catch (e) {
          console.error(e);
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
      this.useRawApi(api, async (requestData, context) => {
        return this.createService(serviceClass, context).handle(requestData);
      });
    };
  }

  createService<Req extends ApiRequest, Resp extends ApiResponse>(
    serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>,
    context: MiddlewareContext
  ) {
    return new serviceClass(context.dbSession);
  }

  static handleError(
    error: any,
    { response }: { request: IRequest; response: IResponse }
  ) {
    if (!error.code || !error.toJson) {
      error = new ServerException();
    }
    response
      .status(error.code)
      .send({ code: error.code, error: error.toJson() });
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
