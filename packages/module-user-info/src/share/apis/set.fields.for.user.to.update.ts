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

class SetFieldsForUserToUpdateRequest extends ExactProps<SetFieldsForUserToUpdateRequest> {
  @IsIn(settingConstant.userInfoFields, { each: true })
  public readonly fields: string[];
}

type SetFieldsForUserToUpdateResponse = Empty;

export const SetFieldsForUserToUpdateApi: Api<
  SetFieldsForUserToUpdateRequest,
  SetFieldsForUserToUpdateResponse,
  UnauthorizedException | ForbiddenException
> = {
  method: 'POST',
  path: '/fields-for-user-to-update',
  validator: SetFieldsForUserToUpdateRequest,
  permission: Permissions.UpdateSetting,
};
