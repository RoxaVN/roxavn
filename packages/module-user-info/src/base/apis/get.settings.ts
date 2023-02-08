import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  UnauthorizedException,
} from '@roxavn/core/base';
import { GetModuleSettingResponse } from '@roxavn/module-utils/base';

import { baseModule } from '../module';
import { Permissions } from '../roles';

class GetSettingsRequest extends ExactProps<GetSettingsRequest> {
  @IsOptional()
  public readonly name?: string;
}

export const getSettingsApi: Api<
  GetSettingsRequest,
  GetModuleSettingResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/settings',
  validator: GetSettingsRequest,
  permission: Permissions.ReadSettings,
});