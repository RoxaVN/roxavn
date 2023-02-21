import { BaseService } from '@roxavn/core/server';
import { Empty } from '@roxavn/core/base';

import {
  UpdateSettingRequest,
  GetModuleSettingRequest,
  GetModuleSettingResponse,
} from '../../base';
import { Setting } from '../entities';

export class UpdateSettingService extends BaseService<
  UpdateSettingRequest,
  Empty
> {
  async handle(request: UpdateSettingRequest) {
    await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(Setting)
      .values({
        module: request.module,
        name: request.name,
        metadata: request.metadata,
      })
      .orUpdate(['metadata'], ['module', 'name'])
      .execute();
    return {};
  }
}

export class GetModuleSettingService extends BaseService<
  GetModuleSettingRequest,
  GetModuleSettingResponse
> {
  async handle(request: GetModuleSettingRequest) {
    const items = await this.dbSession.getRepository(Setting).find({
      where: { module: request.module, name: request.name },
    });
    return { items };
  }
}
