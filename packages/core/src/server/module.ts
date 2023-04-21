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
  authorizationMiddleware,
  ServerLoaderContext,
  ServerLoaderContextHelper,
  ServerMiddleware,
  validatorMiddleware,
} from './middlewares';
import { ApiService } from './service';

export class ServerModule extends BaseModule {
  static apiRoutes: Array<{
    api: Api;
    handler: (
      request: Request,
      helper: ServerLoaderContextHelper
    ) => Promise<Response>;
  }> = [];
  static apiMiddlewares: Array<ServerMiddleware> = [];
  static loaderMiddlewares: Array<ServerMiddleware> = [];
  static validatorMiddleware = validatorMiddleware;
  static authorizationMiddleware = authorizationMiddleware;
  static authenticatorMiddleware: ServerMiddleware = () => {
    throw new Error('authenticatorMiddleware not implemented');
  };

  static authenticatorLoaderMiddleware: ServerMiddleware = () => {
    throw new Error('authenticatorLoaderMiddleware not implemented');
  };

  readonly entities: any[] = [];

  useRawApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>,
    handler: (requestData: Req, context: ServerLoaderContext) => Promise<Resp>
  ) {
    ServerModule.apiRoutes.push({
      api: api,
      handler: async (request, helper) => {
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
          const context = {
            api,
            request,
            helper,
            state: {},
            dbSession: queryRunner.manager,
          };
          for (const middleware of middlewares) {
            await middleware(context);
          }
          const result = await handler(context.state as Req, context);
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
    return (serviceClass: {
      new (...args: any[]): ApiService<Api<Req, Resp>>;
      $api?: Api;
    }) => {
      serviceClass.$api = api;
      this.useRawApi(api, async (requestData, args) => {
        return this.createService(serviceClass, args).handle(requestData);
      });
    };
  }

  createService<Req extends ApiRequest, Resp extends ApiResponse>(
    serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>,
    context: ServerLoaderContext
  ) {
    return new serviceClass(context.dbSession);
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
