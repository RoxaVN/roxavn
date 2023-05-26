import { InferApiRequest } from '@roxavn/core/base';
import { BaseService, inject } from '@roxavn/core/server';
import { serverModule as uploadServerModule } from '@roxavn/module-upload/server';
import { UpdateSettingService } from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(settingApi.updateSeaweedFSSetting)
export class UpdateSeaweedFSSettingApiService extends BaseService {
  constructor(
    @inject(UpdateSettingService)
    private updateSettingService: UpdateSettingService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof settingApi.updateSeaweedFSSetting>
  ) {
    const result = await this.updateSettingService.handle({
      module: uploadServerModule.name,
      name: constants.SEAWEEDFS_SETTING,
      metadata: { masterUrl: request.masterUrl },
      type: 'private',
    });

    return result;
  }
}
