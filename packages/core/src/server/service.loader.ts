import { json, LoaderArgs, TypedResponse } from '@remix-run/node';

import {
  Api,
  ApiRequest,
  ApiResponse,
  constants,
  LogicException,
} from '../base';
import { databaseManager } from './database';
import { BaseService } from './service';
import { ServerModule } from './module';

export class ServiceLoaderItem<
  Req extends ApiRequest = ApiRequest,
  Resp extends ApiResponse = ApiResponse
> {
  constructor(
    public service: {
      new (...args: any[]): BaseService<Req, Resp>;
      $api?: Api;
    },
    public options?: {
      params?: Partial<Req>;
      checkPermission?: boolean;
    }
  ) {}
}

class ServicesLoader {
  async load<S extends Record<string, ServiceLoaderItem>>(
    args: LoaderArgs,
    services: S
  ): Promise<
    TypedResponse<{
      [k in keyof S]: S[k] extends ServiceLoaderItem<any, infer U> ? U : never;
    }>
  > {
    const queryRunner = databaseManager.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any = {};
      const requestData = (args.context as any).getRequestData();
      for (const key of Object.keys(services)) {
        const serviceClass = services[key].service;
        let state = { ...services[key].options?.params };
        if (serviceClass.$api) {
          const argsMiddleware = {
            api: serviceClass.$api,
            request: args.request,
            context: args.context as any,
            state,
            dbSession: queryRunner.manager,
          };
          const middlewares = [...ServerModule.loaderMiddlewares];
          if (services[key].options?.checkPermission) {
            middlewares.unshift(ServerModule.authorizationMiddleware);
            middlewares.unshift(ServerModule.authenticatorLoaderMiddleware);
          }
          if (requestData[constants.LOCATION_SEARCH_KEY] === key) {
            Object.assign(state, requestData);
            middlewares.unshift(ServerModule.validatorMiddleware);
          }
          for (const middleware of middlewares) {
            await middleware(argsMiddleware);
          }
          state = argsMiddleware.state;
        }

        const service = new serviceClass(queryRunner.manager);
        result[key] = await service.handle(state);
      }
      return json(result);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof LogicException) {
        throw new Response(e.type, { status: e.code });
      }
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}

export const servicesLoader = new ServicesLoader();
