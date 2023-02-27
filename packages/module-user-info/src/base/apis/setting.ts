import { accessManager, ApiSource, ExactProps, IsIn } from '@roxavn/core/base';
import { SettingResponse } from '@roxavn/module-utils/base';

import { constants } from '../constants';
import { baseModule } from '../module';
import { permissions } from '../access';

const settingSource = new ApiSource<SettingResponse>(
  [accessManager.scopes.Setting],
  baseModule
);

class SetFieldsToUpdateRequest extends ExactProps<SetFieldsToUpdateRequest> {
  @IsIn(constants.USER_INFO_FIELDS, { each: true })
  public readonly fields: string[];
}

export const settingApi = {
  setFieldsForAdminToUpdate: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/fields-for-admin-to-update',
    validator: SetFieldsToUpdateRequest,
    permission: permissions.UpdateSetting,
  }),
  setFieldsForUserToUpdate: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/fields-for-user-to-update',
    validator: SetFieldsToUpdateRequest,
    permission: permissions.UpdateSetting,
  }),
};
