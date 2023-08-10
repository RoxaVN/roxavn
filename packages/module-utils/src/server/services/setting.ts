import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import {
  NotFoundSettingException,
  SettingType,
  UpdateSettingRequest,
} from '../../base/index.js';
import { Setting } from '../entities/index.js';
import { serverModule } from '../module.js';
import { settingApi } from '../../base/apis/index.js';

@serverModule.useApi(settingApi.getPublic)
export class GetPublicSettingService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof settingApi.getPublic>) {
    const result = await this.entityManager.getRepository(Setting).findOne({
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
export class GetModuleSettingsService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof settingApi.getAll>) {
    const items = await this.entityManager.getRepository(Setting).find({
      where: { module: request.module },
    });
    return { items };
  }
}

@serverModule.injectable()
export class GetSettingService extends InjectDatabaseService {
  async handle(request: { module: string; name: string }) {
    const result = await this.entityManager.getRepository(Setting).findOne({
      where: {
        name: request.name,
        module: request.module,
      },
    });
    if (result) {
      return result.metadata;
    }
    throw new NotFoundSettingException(request.name, request.module);
  }
}

@serverModule.injectable()
export class UpdateSettingService extends InjectDatabaseService {
  async handle(request: UpdateSettingRequest) {
    await this.entityManager
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

@serverModule.injectable()
export class CreateSettingService extends InjectDatabaseService {
  async handle(request: {
    module: string;
    name: string;
    metadata: Record<string, any>;
    type: SettingType;
  }) {
    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(Setting)
      .values({
        module: request.module,
        name: request.name,
        metadata: request.metadata,
        type: request.type,
      })
      .orIgnore()
      .execute();
    return {};
  }
}
