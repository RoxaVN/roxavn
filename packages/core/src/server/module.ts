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
import { eventManager } from './event/index.js';
import { autoBind, BaseService, rebind } from './service/base.js';
import { serviceContainer } from './service/container.js';
import { constants } from './constants.js';

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

  onBeforeServerStart?: () => Promise<void>;
  onAfterServerStart?: () => Promise<void>;
  onBeforeServerStop?: () => Promise<void>;
  onAfterServerStop?: () => Promise<void>;

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (serviceClass: {
      new (...args: any[]): BaseService<Req, Resp>;
      $api?: Api;
    }) => {
      serviceClass.$api = api;
      autoBind()(serviceClass);

      ServerModule.apiRoutes.push({
        api: api,
        handler: async (request, helper) => {
          const state = { request: {} };
          const result = await databaseManager.dataSource.transaction(
            async (dbSession) => {
              const middlewares = [
                ServerModule.validatorMiddleware,
                ServerModule.authenticatorMiddleware,
                ServerModule.authorizationMiddleware,
                ...ServerModule.apiMiddlewares,
              ];

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

              const service = await serviceContainer.getAsync(serviceClass);
              const params = [context.state.request];
              Reflect.getOwnMetadata(
                constants.API_CONTEXT_METADATA_KEY,
                serviceClass,
                'handle'
              )?.map((handler: any, index: number) => {
                if (handler) {
                  params[index] = handler(context);
                }
              });

              const result = await service.handle(...params);

              return json({ code: 200, data: result });
            }
          );

          eventManager.distributor.emit(eventManager.makeApiSuccessEvent(api), {
            request: state.request,
            response: result,
          });

          return result;
        },
      });
    };
  }

  injectable = autoBind;
  rebind = rebind;

  bindFactory() {
    return (target: any, propertyKey: string) => {
      serviceContainer.bind(target).toDynamicValue((context) => {
        return target[propertyKey](context);
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
    options?: {
      entities?: Record<string, any>;
    }
  ) {
    const module = new ServerModule(base.name, base.options);
    if (options?.entities) {
      module.entities.push(...Object.values(options.entities));
    }
    return module;
  }
}

export const serverModule = ServerModule.fromBase(baseModule);
