import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { serverModule as userServerModule } from '@roxavn/module-user/server';
import { UpdateSettingService } from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base';
import { serverModule } from '../module';

@serverModule.useApi(settingApi.updateFirbaseServerSetting)
export class UpdateFirbaseServerSettingApiService extends ApiService {
  async handle(
    request: InferApiRequest<typeof settingApi.updateFirbaseServerSetting>
  ) {
    return this.create(UpdateSettingService).handle({
      module: userServerModule.name,
      name: constants.FIREBASE_SERVER_SETTING,
      metadata: { serviceAccounts: request.serviceAccounts },
      type: 'private',
    });
  }
}
