import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { serverModule as uploadServerModule } from '@roxavn/module-upload/server';
import { UpdateSettingService } from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base';
import { serverModule } from '../module';

@serverModule.useApi(settingApi.updateSeaweedFSMasterUrlSetting)
export class UpdateSeaweedFSMasterUrlSettingApiService extends ApiService {
  async handle(
    request: InferApiRequest<typeof settingApi.updateSeaweedFSMasterUrlSetting>
  ) {
    return this.create(UpdateSettingService).handle({
      module: uploadServerModule.name,
      name: constants.SEAWEEDFS_MASTER_URL_SETTING,
      metadata: { url: request.url },
      type: 'private',
    });
  }
}
