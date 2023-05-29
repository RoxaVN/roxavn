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
  serviceContainer,
} from '../service/index.js';
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
      const state: any = { request: { ...args.params }, response: {} };
      const middlewareManager = await serviceContainer.getAsync(
        MiddlewareManager
      );
      const middlewares = await middlewareManager.getLoaderMiddlewares();
      const context: any = {
        api: options?.api,
        request: args.request,
        state,
        helper: args.context,
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
          state.response[key] = await handleService(serviceClass, context);
        }
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
