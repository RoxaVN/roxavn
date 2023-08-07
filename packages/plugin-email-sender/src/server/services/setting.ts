import { InferApiRequest } from '@roxavn/core/base';
import { BaseService, inject } from '@roxavn/core/server';
import {
  UpdateSettingService,
  serverModule as utilsServerModule,
} from '@roxavn/module-utils/server';

import { constants, settingApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(settingApi.updateEmailSenderSetting)
export class UpdateEmailSenderSettingApiService extends BaseService {
  constructor(
    @inject(UpdateSettingService)
    private updateSettingService: UpdateSettingService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof settingApi.updateEmailSenderSetting>
  ) {
    return this.updateSettingService.handle({
      module: utilsServerModule.name,
      name: constants.EMAIL_SENDER_SETTING,
      metadata: { sender: request.sender, settings: request.settings },
      type: 'private',
    });
  }
}
