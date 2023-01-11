import {
  Api,
  Empty,
  ExactProps,
  ForbiddenException,
  IsIn,
  UnauthorizedException,
} from '@roxavn/core/share';

import { settingConstant } from '../constants';
import { baseModule } from '../module';
import { Permissions } from '../roles';

class SetFieldsForUserToUpdateRequest extends ExactProps<SetFieldsForUserToUpdateRequest> {
  @IsIn(settingConstant.userInfoFields, { each: true })
  public readonly fields: string[];
}

type SetFieldsForUserToUpdateResponse = Empty;

export const setFieldsForUserToUpdateApi: Api<
  SetFieldsForUserToUpdateRequest,
  SetFieldsForUserToUpdateResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'POST',
  path: '/fields-for-user-to-update',
  validator: SetFieldsForUserToUpdateRequest,
  permission: Permissions.UpdateSetting,
});
