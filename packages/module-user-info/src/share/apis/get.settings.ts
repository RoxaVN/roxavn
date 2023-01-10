import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  UnauthorizedException,
} from '@roxavn/core/share';
import { GetModuleSettingResponse } from '@roxavn/module-utils/share';

import { Permissions } from '../roles';

class GetSettingsRequest extends ExactProps<GetSettingsRequest> {
  @IsOptional()
  public readonly name?: string;
}

export const GetSettingsApi: Api<
  GetSettingsRequest,
  GetModuleSettingResponse,
  UnauthorizedException | ForbiddenException
> = {
  method: 'GET',
  path: '/settings',
  validator: GetSettingsRequest,
  permission: Permissions.ReadSettings,
};
