import {
  accessManager,
  ApiSource,
  ArrayMinSize,
  ExactProps,
  IsArray,
  IsNotEmptyObject,
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
  @IsNotEmptyObject({}, { each: true })
  public readonly serviceAccounts: Array<Record<string, any>>;
}

export const settingApi = {
  updateFirbaseServerSetting: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/server',
    validator: UpdateFirbaseServerSettingRequest,
    permission: permissions.UpdateSetting,
  }),
};
