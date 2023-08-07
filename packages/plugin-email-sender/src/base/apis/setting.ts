import {
  accessManager,
  ApiSource,
  ExactProps,
  IsNotEmptyObject,
  MinLength,
} from '@roxavn/core/base';
import { SettingResponse, permissions } from '@roxavn/module-utils/base';

import { baseModule } from '../module.js';

const settingSource = new ApiSource<SettingResponse>(
  [accessManager.scopes.Setting],
  baseModule
);

class UpdateEmailSenderSettingRequest extends ExactProps<UpdateEmailSenderSettingRequest> {
  @IsNotEmptyObject()
  public readonly settings: Record<string, any>;

  @MinLength(1)
  public readonly sender: string;
}

export const settingApi = {
  updateEmailSenderSetting: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath(),
    validator: UpdateEmailSenderSettingRequest,
    permission: permissions.UpdateSetting,
  }),
};
