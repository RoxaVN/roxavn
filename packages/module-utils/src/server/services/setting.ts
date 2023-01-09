import { BaseService } from '@roxavn/core/server';
import { Collection, Empty } from '@roxavn/core/share';
import { Setting } from '../entities';

interface CreateSettingRequest {
  module: string;
  name: string;
  metadata: any;
}

export class CreateSettingService extends BaseService<
  CreateSettingRequest,
  Empty
> {
  async handle(request: CreateSettingRequest) {
    const setting = new Setting();
    setting.module = request.module;
    setting.name = request.name;
    setting.metadata = request.metadata;
    await this.dataSource.getRepository(Setting).save(setting);
    return {};
  }
}

interface GetModuleSettingRequest {
  module: string;
}

export class GetModuleSettingService extends BaseService<
  GetModuleSettingRequest,
  Collection<Setting>
> {
  async handle(request: GetModuleSettingRequest) {
    const items = await this.dataSource.getRepository(Setting).find({
      where: { module: request.module },
    });
    return { items };
  }
}
