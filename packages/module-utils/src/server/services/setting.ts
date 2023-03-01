import { Empty, InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { ApiService, BaseService } from '@roxavn/core/server';

import { UpdateSettingRequest } from '../../base';
import { Setting } from '../entities';
import { serverModule } from '../module';
import { settingApi } from '../../base/apis';

@serverModule.useApi(settingApi.getPublic)
export class GetPublicSettingService extends ApiService {
  async handle(request: InferApiRequest<typeof settingApi.getPublic>) {
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

@serverModule.useApi(settingApi.getAll)
export class GetModuleSettingsService extends ApiService {
  async handle(request: InferApiRequest<typeof settingApi.getAll>) {
    const items = await this.dbSession.getRepository(Setting).find({
      where: { module: request.module },
    });
    return { items };
  }
}

export class GetSettingService extends BaseService {
  async handle(request: { module: string; name: string }) {
    const result = await this.dbSession.getRepository(Setting).findOne({
      where: {
        name: request.name,
        module: request.module,
      },
    });
    return result?.metadata;
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
