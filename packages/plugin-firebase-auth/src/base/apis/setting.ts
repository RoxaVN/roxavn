import {
  ApiSource,
  ExactProps,
  MinLength,
  TransformJson,
} from '@roxavn/core/base';
import { Permissions } from '@roxavn/module-user/base';
import {
  Resources as UtilsResources,
  SettingResponse,
} from '@roxavn/module-utils/base';

import { baseModule } from '../module';

const settingSource = new ApiSource<SettingResponse>(
  [UtilsResources.Setting],
  baseModule
);

class UpdateFirbaseServerSettingRequest extends ExactProps<UpdateFirbaseServerSettingRequest> {
  @TransformJson()
  public readonly serviceAccount: any;
}

class UpdateFirbaseClientSettingRequest extends ExactProps<UpdateFirbaseClientSettingRequest> {
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
    permission: Permissions.UpdateSetting,
  }),
  updateFirbaseClientSetting: settingSource.custom({
    method: 'POST',
    path: settingSource.apiPath() + '/client',
    validator: UpdateFirbaseClientSettingRequest,
    permission: Permissions.UpdateSetting,
  }),
};
