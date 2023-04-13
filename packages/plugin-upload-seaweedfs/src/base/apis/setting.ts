import { accessManager, ApiSource, ExactProps, IsUrl } from '@roxavn/core/base';
import { SettingResponse, permissions } from '@roxavn/module-utils/base';

import { baseModule } from '../module';

const settingSource = new ApiSource<SettingResponse>(
  [accessManager.scopes.Setting],
  baseModule
);

class UpdateSeaweedFSMasterUrlSettingRequest extends ExactProps<UpdateSeaweedFSMasterUrlSettingRequest> {
  @IsUrl({ require_tld: false })
  public readonly url: string;
}

export const settingApi = {
  updateSeaweedFSMasterUrlSetting: settingSource.custom({
    method: 'post',
    path: settingSource.apiPath() + '/seaweedfs_url',
    validator: UpdateSeaweedFSMasterUrlSettingRequest,
    permission: permissions.UpdateSetting,
  }),
};
