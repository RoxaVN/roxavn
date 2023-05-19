import {
  accessManager,
  ApiSource,
  ArrayMinSize,
  ExactProps,
  IsArray,
  IsNotEmptyObject,
} from '@roxavn/core/base';
import { SettingResponse, permissions } from '@roxavn/module-utils/base';

import { baseModule } from '../module.js';

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
    method: 'post',
    path: settingSource.apiPath() + '/server',
    validator: UpdateFirbaseServerSettingRequest,
    permission: permissions.UpdateSetting,
  }),
};
