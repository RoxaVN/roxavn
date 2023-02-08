import {
  Api,
  Empty,
  ExactProps,
  ForbiddenException,
  IsIn,
  UnauthorizedException,
} from '@roxavn/core/base';

import { settingConstant } from '../constants';
import { baseModule } from '../module';
import { Permissions } from '../roles';

class SetFieldsForAdminToUpdateRequest extends ExactProps<SetFieldsForAdminToUpdateRequest> {
  @IsIn(settingConstant.userInfoFields, { each: true })
  public readonly fields: string[];
}

type SetFieldsForAdminToUpdateResponse = Empty;

export const setFieldsForAdminToUpdateApi: Api<
  SetFieldsForAdminToUpdateRequest,
  SetFieldsForAdminToUpdateResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'POST',
  path: '/fields-for-admin-to-update',
  validator: SetFieldsForAdminToUpdateRequest,
  permission: Permissions.UpdateSetting,
});
