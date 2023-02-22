import { ApiSource, ExactProps, MinLength } from '@roxavn/core/base';
import { NotFoundError } from 'rxjs';

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
  getPublic: settingSource.custom<GetPublicSettingRequest, any, NotFoundError>({
    method: 'GET',
    path: settingSource.apiPath() + '/public',
    validator: GetPublicSettingRequest,
  }),
};
