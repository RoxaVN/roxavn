import {
  Api,
  Empty,
  ExactProps,
  ForbiddenException,
  IsIn,
  UnauthorizedException,
} from '@roxavn/core/share';

import { settingConstant } from '../constants';
import { Permissions } from '../roles';

class SetFieldsForAdminToUpdateRequest extends ExactProps<SetFieldsForAdminToUpdateRequest> {
  @IsIn(settingConstant.userInfoFields, { each: true })
  public readonly fields: string[];
}

type SetFieldsForAdminToUpdateResponse = Empty;

export const SetFieldsForAdminToUpdateApi: Api<
  SetFieldsForAdminToUpdateRequest,
  SetFieldsForAdminToUpdateResponse,
  UnauthorizedException | ForbiddenException
> = {
  method: 'POST',
  path: '/fields-for-admin-to-update',
  validator: SetFieldsForAdminToUpdateRequest,
  permission: Permissions.UpdateSetting,
};
