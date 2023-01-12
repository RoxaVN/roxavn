import {
  Api,
  ExactProps,
  ForbiddenException,
  IsArray,
  IsOptional,
  Collection,
  UnauthorizedException,
} from '@roxavn/core/share';

import { RoleResponse } from '../interfaces';
import { baseModule } from '../module';

class GetUserRolesRequest extends ExactProps<GetUserRolesRequest> {
  @IsArray()
  @IsOptional()
  public readonly scopes?: string[];

  @IsOptional()
  public readonly scopeId?: string;
}

type GetUserRolesResponse = Collection<RoleResponse>;

export const getUserRolesApi: Api<
  GetUserRolesRequest,
  GetUserRolesResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/user-roles',
  validator: GetUserRolesRequest,
});
