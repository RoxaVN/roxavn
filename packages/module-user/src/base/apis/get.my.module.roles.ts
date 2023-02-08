import {
  Api,
  ExactProps,
  ForbiddenException,
  Collection,
  UnauthorizedException,
} from '@roxavn/core/base';
import { RoleResponse } from '../interfaces';
import { baseModule } from '../module';

class GetMyModuleRolesRequest extends ExactProps<GetMyModuleRolesRequest> {}

type GetMyModuleRolesResponse = Collection<RoleResponse>;

export const getMyModuleRolesApi: Api<
  GetMyModuleRolesRequest,
  GetMyModuleRolesResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/module-roles/me',
});
