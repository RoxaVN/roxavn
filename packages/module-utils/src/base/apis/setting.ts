import {
  ApiSource,
  ExactProps,
  MinLength,
  NotFoundException,
} from '@roxavn/core/base';

import { SettingResponse } from '../interfaces';
import { baseModule } from '../module';
import { Resources } from '../roles';

const settingSource = new ApiSource<SettingResponse>(
  [Resources.Setting],
  baseModule
);

class GetPublicSettingRequest extends ExactProps<GetPublicSettingRequest> {
  @MinLength(1)
  public readonly module!: string;

  @MinLength(1)
  public readonly name!: string;
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
};
