import {
  accessManager,
  ApiSource,
  ArrayMinSize,
  ExactProps,
  IsArray,
  MinLength,
} from '@roxavn/core/base';
import { permissions } from '@roxavn/module-user/base';
import { SettingResponse } from '@roxavn/module-utils/base';

import { baseModule } from '../module';

const settingSource = new ApiSource<SettingResponse>(
  [accessManager.scopes.Setting],
  baseModule
);

class UpdateFirbaseServerSettingRequest extends ExactProps<UpdateFirbaseServerSettingRequest> {
  @IsArray()
  @ArrayMinSize(1)
  @MinLength(1, { each: true })
  public readonly serviceAccounts: string[];
}

class UpdateFirbaseClientSettingRequest extends ExactProps<UpdateFirbaseClientSettingRequest> {
  @MinLength(1)
  public readonly projectId: string;

  @MinLength(1)
  public readonly apiKey: string;

  @MinLength(1)
  public readonly authDomain: string;
}

export const settingApi = {
  updateFirbaseServerSetting: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/server',
    validator: UpdateFirbaseServerSettingRequest,
    permission: permissions.UpdateSetting,
  }),
  updateFirbaseClientSetting: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/client',
    validator: UpdateFirbaseClientSettingRequest,
    permission: permissions.UpdateSetting,
  }),
};
