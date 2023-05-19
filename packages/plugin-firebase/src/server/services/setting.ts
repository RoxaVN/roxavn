import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import {
  UpdateSettingService,
  serverModule as utilsServerModule,
} from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(settingApi.updateFirbaseServerSetting)
export class UpdateFirbaseServerSettingApiService extends ApiService {
  async handle(
    request: InferApiRequest<typeof settingApi.updateFirbaseServerSetting>
  ) {
    return this.create(UpdateSettingService).handle({
      module: utilsServerModule.name,
      name: constants.FIREBASE_SERVER_SETTING,
      metadata: { serviceAccounts: request.serviceAccounts },
      type: 'private',
    });
  }
}
