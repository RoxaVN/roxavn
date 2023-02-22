import { ApiService, BaseService } from '@roxavn/core/server';
import { Empty, InferApiResponse, NotFoundException } from '@roxavn/core/base';

import {
  UpdateSettingRequest,
  GetModuleSettingsRequest,
  GetModuleSettingsResponse,
} from '../../base';
import { Setting } from '../entities';
import { serverModule } from '../module';
import { settingApi } from '../../base/apis';

@serverModule.useApi(settingApi.getPublic)
export class GetPublicSettingService extends ApiService {
  async handle(request: InferApiResponse<typeof settingApi.getPublic>) {
    const result = await this.dbSession.getRepository(Setting).findOne({
      select: ['metadata'],
      where: { module: request.module, name: request.name, type: 'public' },
    });
    if (result) {
      return result.metadata;
    }
    throw new NotFoundException();
  }
}

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
        type: request.type,
      })
      .orUpdate(['metadata', 'type'], ['module', 'name'])
      .execute();
    return {};
  }
}

export class GetModuleSettingsService extends BaseService<
  GetModuleSettingsRequest,
  GetModuleSettingsResponse
> {
  async handle(request: GetModuleSettingsRequest) {
    const items = await this.dbSession.getRepository(Setting).find({
      where: { module: request.module, name: request.name },
    });
    return { items };
  }
}
