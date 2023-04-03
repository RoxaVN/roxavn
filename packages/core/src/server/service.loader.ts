import { json, LoaderArgs, TypedResponse } from '@remix-run/node';

import { ApiRequest, ApiResponse, LogicException } from '../base';
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
      for (const key of Object.keys(services)) {
        const filters = args.params.filters
          ? JSON.parse(args.params.filters)
          : undefined;
        const service = new services[key].service(queryRunner.manager);
        result[key] = await service.handle({
          ...services[key].params,
          ...filters?.[key],
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
