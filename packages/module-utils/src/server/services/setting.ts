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
    const setting = new Setting();
    setting.module = request.module;
    setting.name = request.name;
    setting.metadata = request.metadata;
    await this.dbSession.getRepository(Setting).save(setting);
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
