import {
  accessManager,
  ApiSource,
  ExactProps,
  MinLength,
  NotFoundException,
} from '@roxavn/core/base';
import { permissions } from '../access.js';

import { SettingResponse } from '../interfaces/index.js';
import { baseModule } from '../module.js';

const settingSource = new ApiSource<SettingResponse>(
  [accessManager.scopes.Setting],
  baseModule
);

class GetPublicSettingRequest extends ExactProps<GetPublicSettingRequest> {
  @MinLength(1)
  public readonly module!: string;

  @MinLength(1)
  public readonly name!: string;
}

class GetModuleSettingsRequest extends ExactProps<GetModuleSettingsRequest> {
  @MinLength(1)
  public readonly module!: string;
}

export const settingApi = {
  getPublic: settingSource.custom<
    GetPublicSettingRequest,
    any,
    NotFoundException
  >({
    method: 'GET',
    path: settingSource.apiPath() + '/public',
    validator: GetPublicSettingRequest,
  }),
  getAll: settingSource.getAll({
    validator: GetModuleSettingsRequest,
    permission: permissions.ReadSettings,
  }),
};
