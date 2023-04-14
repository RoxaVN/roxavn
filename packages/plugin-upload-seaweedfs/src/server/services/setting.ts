import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { serverModule as uploadServerModule } from '@roxavn/module-upload/server';
import { UpdateSettingService } from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base';
import { serverModule } from '../module';
import { SeaweedFSStorageHandlerService } from './storage.handler';

@serverModule.useApi(settingApi.updateSeaweedFSSetting)
export class UpdateSeaweedFSSettingApiService extends ApiService {
  async handle(
    request: InferApiRequest<typeof settingApi.updateSeaweedFSSetting>
  ) {
    const result = await this.create(UpdateSettingService).handle({
      module: uploadServerModule.name,
      name: constants.SEAWEEDFS_SETTING,
      metadata: { masterUrl: request.masterUrl },
      type: 'private',
    });

    // reset handler cache
    SeaweedFSStorageHandlerService.handler = undefined;
    return result;
  }
}
