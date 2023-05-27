import { json } from '@remix-run/node';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  ServerException,
} from '../base/index.js';
import { compose, MiddlewareManager } from './middlewares/index.js';
import { autoBind, BaseService, rebind } from './service/base.js';
import { serviceContainer } from './service/container.js';
import { handleService, RemixLoaderContextHelper } from './service/context.js';

export class ServerModule extends BaseModule {
  static apiRoutes: Array<{
    api: Api;
    handler: (
      request: Request,
      helper: RemixLoaderContextHelper
    ) => Promise<Response>;
  }> = [];

  readonly entities: any[] = [];

  onBeforeServerStart?: () => Promise<void>;
  onAfterServerStart?: () => Promise<void>;
  onBeforeServerStop?: () => Promise<void>;
  onAfterServerStop?: () => Promise<void>;

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (serviceClass: { new (...args: any[]): BaseService<Req, Resp> }) => {
      autoBind()(serviceClass);

      ServerModule.apiRoutes.push({
        api: api,
        handler: async (request, helper) => {
          const state: any = { request: {} };
          const middlewareManager = await serviceContainer.getAsync(
            MiddlewareManager
          );
          const middlewares = await middlewareManager.getApiMiddlewares();
          const context = { api, request, state, helper };
          await compose(middlewares)(context, async () => {
            state.response = await handleService(serviceClass, context);
          });
          return json({ code: 200, data: state.response });
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
