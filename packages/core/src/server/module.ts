import { json } from '@remix-run/node';
import { MigrationInterface } from 'typeorm';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  ServerException,
} from '../base/index.js';
import {
  ApiMiddlewareManager,
  compose,
  LoaderMiddlewareManager,
  MiddlewareServiceClass,
} from './middleware.js';
import { autoBind, BaseService, rebind } from './services/base.js';
import {
  handleService,
  RemixLoaderContextHelper,
  RouterContext,
  RouterContextState,
  serviceContainer,
} from './services/index.js';
import { bindFactory } from './services/utils.js';
import { ApiErrorJobManager, ApiSuccessJobManager } from './jobs/manager.js';
import {
  ApiErrorEventManager,
  ApiSuccessEventManager,
} from './events/manager.js';

export class ServerModule extends BaseModule {
  static apiRoutes: Array<{
    api: Api;
    handler: (
      request: Request,
      helper: RemixLoaderContextHelper
    ) => Promise<Response>;
  }> = [];

  readonly entities: any[] = [];
  readonly migrations: { new (): MigrationInterface }[] = [];

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
          const state: RouterContextState = {
            request: helper.getRequestData(),
            ip: helper.getClientIp(),
            headers: request.headers,
          };
          const middlewareManager = await serviceContainer.getAsync(
            ApiMiddlewareManager
          );
          const middlewares = await middlewareManager.getMiddlewares();
          const context: RouterContext = { api, request, state };
          await compose(middlewares)(context, async (ctx) => {
            state.response = await handleService(serviceClass, ctx);
          });
          return json({ code: 200, data: state.response });
        },
      });
    };
  }

  injectable = autoBind;
  rebind = rebind;
  bindFactory = bindFactory;

  useApiMiddleware() {
    return (serviceClass: MiddlewareServiceClass) => {
      autoBind()(serviceClass);
      ApiMiddlewareManager.middlewareServices.push(serviceClass);
    };
  }

  useLoaderMiddleware() {
    return (serviceClass: MiddlewareServiceClass) => {
      autoBind()(serviceClass);
      LoaderMiddlewareManager.middlewareServices.push(serviceClass);
    };
  }

  useApiSuccessJob<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (serviceClass: any) => {
      autoBind()(serviceClass);
      ApiSuccessJobManager.push({ serviceClass, api });
    };
  }

  useApiErrorJob<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (serviceClass: any) => {
      autoBind()(serviceClass);
      ApiErrorJobManager.push({ serviceClass, api });
    };
  }

  onApiSuccess<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (serviceClass: any) => {
      autoBind()(serviceClass);
      ApiSuccessEventManager.items.push({ serviceClass, api });
    };
  }

  onApiError<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (serviceClass: any) => {
      autoBind()(serviceClass);
      ApiErrorEventManager.items.push({ serviceClass, api });
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
      migrations?: Record<string, { new (): MigrationInterface }>;
    }
  ) {
    const module = new ServerModule(base.name, base.options);
    if (options?.entities) {
      module.entities.push(...Object.values(options.entities));
    }
    if (options?.migrations) {
      module.migrations.push(...Object.values(options.migrations));
    }
    return module;
  }
}

export const serverModule = ServerModule.fromBase(baseModule);
