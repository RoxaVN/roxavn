import { ApiSource, ExactProps, IsIn, IsOptional } from '@roxavn/core/base';
import {
  Resources as UtilsResources,
  SettingResponse,
} from '@roxavn/module-utils/base';

import { constants } from '../constants';
import { baseModule } from '../module';
import { Permissions } from '../roles';

const settingSource = new ApiSource<SettingResponse>(
  [UtilsResources.Setting],
  baseModule
);

class SetFieldsToUpdateRequest extends ExactProps<SetFieldsToUpdateRequest> {
  @IsIn(constants.USER_INFO_FIELDS, { each: true })
  public readonly fields: string[];
}

class GetSettingsRequest extends ExactProps<GetSettingsRequest> {
  @IsOptional()
  public readonly name?: string;
}

export const settingApi = {
  setFieldsForAdminToUpdate: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/fields-for-admin-to-update',
    validator: SetFieldsToUpdateRequest,
    permission: Permissions.UpdateSetting,
  }),
  setFieldsForUserToUpdate: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/fields-for-user-to-update',
    validator: SetFieldsToUpdateRequest,
    permission: Permissions.UpdateSetting,
  }),
  getAll: settingSource.getAll({
    validator: GetSettingsRequest,
    permission: Permissions.ReadSettings,
  }),
};
