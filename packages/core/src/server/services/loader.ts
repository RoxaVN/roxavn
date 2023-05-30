import { json, LoaderArgs, TypedResponse } from '@remix-run/node';

import {
  Api,
  ApiRequest,
  ApiResponse,
  LogicException,
} from '../../base/index.js';
import {
  BaseService,
  handleService,
  RemixLoaderContextHelper,
  RouterContext,
  RouterContextState,
  serviceContainer,
} from './index.js';
import { compose, MiddlewareManager } from '../middlewares/manager.js';

export interface ServiceLoaderItem<
  Req extends ApiRequest = ApiRequest,
  Resp extends ApiResponse = ApiResponse
> {
  service: {
    new (...args: any[]): BaseService<Req, Resp>;
  };
  params?: Partial<Req> | { (data: any): Partial<Req> };
}

class ServicesLoader {
  async load<S extends Record<string, ServiceLoaderItem>>(
    args: LoaderArgs,
    services: S,
    options?: {
      /**
       * Api to check permission
       */
      api?: Api;
    }
  ): Promise<
    TypedResponse<{
      [k in keyof S]: S[k] extends ServiceLoaderItem<any, infer U> ? U : never;
    }>
  > {
    try {
      const middlewareManager = await serviceContainer.getAsync(
        MiddlewareManager
      );
      const middlewares = await middlewareManager.getLoaderMiddlewares();
      const helper: RemixLoaderContextHelper = args.context as any;
      const state: RouterContextState = {
        request: { ...args.params, ...helper.getRequestData() },
        ip: helper.getClientIp(),
        headers: args.request.headers,
      };
      const context: RouterContext = {
        api: options?.api,
        request: args.request,
        state,
      };
      await compose(middlewares)(context, async () => {
        const request = state.request;
        for (const key of Object.keys(services)) {
          const serviceClass = services[key].service;
          const serviceParams = services[key].params;
          state.request = {
            ...(typeof serviceParams === 'function'
              ? serviceParams(state.response)
              : serviceParams),
            ...request,
          };
          if (!state.response) {
            state.response = {};
          }
          state.response[key] = await handleService(serviceClass, context);
        }
        state.request = request;
      });
      return json(state.response as any);
    } catch (e) {
      if (e instanceof LogicException) {
        throw new Response(e.type, { status: e.code });
      }
      throw e;
    }
  }
}

export const servicesLoader = new ServicesLoader();
