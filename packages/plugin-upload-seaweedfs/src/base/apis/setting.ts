import { accessManager, ApiSource, ExactProps, IsUrl } from '@roxavn/core/base';
import { SettingResponse, permissions } from '@roxavn/module-utils/base';

import { baseModule } from '../module.js';

const settingSource = new ApiSource<SettingResponse>(
  [accessManager.scopes.Setting],
  baseModule
);

class UpdateSeaweedFSMasterUrlSettingRequest extends ExactProps<UpdateSeaweedFSMasterUrlSettingRequest> {
  @IsUrl({ require_tld: false })
  public readonly masterUrl: string;
}

export const settingApi = {
  updateSeaweedFSSetting: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/seaweedfs',
    validator: UpdateSeaweedFSMasterUrlSettingRequest,
    permission: permissions.UpdateSetting,
  }),
};
