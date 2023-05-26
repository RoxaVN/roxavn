import { InferApiRequest } from '@roxavn/core/base';
import { BaseService, inject } from '@roxavn/core/server';
import {
  UpdateSettingService,
  serverModule as utilsServerModule,
} from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(settingApi.updateFirbaseServerSetting)
export class UpdateFirbaseServerSettingApiService extends BaseService {
  constructor(
    @inject(UpdateSettingService)
    private updateSettingService: UpdateSettingService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof settingApi.updateFirbaseServerSetting>
  ) {
    return this.updateSettingService.handle({
      module: utilsServerModule.name,
      name: constants.FIREBASE_SERVER_SETTING,
      metadata: { serviceAccounts: request.serviceAccounts },
      type: 'private',
    });
  }
}
