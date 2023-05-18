import { json } from '@remix-run/node';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  ServerException,
} from '../base/index.js';
import { databaseManager } from './database/index.js';
import {
  authorizationMiddleware,
  makeContextHelper,
  RemixLoaderContextHelper,
  ServerLoaderContext,
  ServerMiddleware,
  validatorMiddleware,
} from './middlewares/index.js';
import { ApiService, BaseService } from './service.js';
import { eventManager } from './event/index.js';

export class ServerModule extends BaseModule {
  static apiRoutes: Array<{
    api: Api;
    handler: (
      request: Request,
      helper: RemixLoaderContextHelper
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
          const dbSession = queryRunner.manager;
          const state = { request: {} };
          const context = {
            api,
            request,
            state,
            dbSession,
            helper: makeContextHelper(helper, { dbSession, api, state }),
          };
          for (const middleware of middlewares) {
            await middleware(context);
          }
          const result = await handler(context.state.request as Req, context);
          await queryRunner.commitTransaction();
          eventManager.distributor.emit(eventManager.makeApiSuccessEvent(api), {
            request: context.state.request,
            response: result,
          });
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
      this.useRawApi(api, async (requestData, context) => {
        return this.createService(serviceClass, context).handle(requestData);
      });
    };
  }

  createService<T extends BaseService>(
    serviceClass: new (...args: any[]) => T,
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
