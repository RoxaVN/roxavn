import { json, LoaderArgs, TypedResponse } from '@remix-run/node';

import { ApiRequest, ApiResponse, constants, LogicException } from '../base';
import { databaseManager } from './database';
import { BaseService } from './service';

export class ServiceLoaderItem<
  Req extends ApiRequest = ApiRequest,
  Resp extends ApiResponse = ApiResponse
> {
  constructor(
    public service: new (...args: any[]) => BaseService<Req, Resp>,
    public params?: Partial<Req>
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
        const service = new services[key].service(queryRunner.manager);
        result[key] = await service.handle({
          ...services[key].params,
          ...(requestData[constants.LOCATION_SEARCH_KEY] === key
            ? requestData
            : {}),
        });
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
