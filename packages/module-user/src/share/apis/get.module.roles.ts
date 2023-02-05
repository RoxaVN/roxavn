import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  Min,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/share';
import { Type } from 'class-transformer';
import { RoleResponse } from '../interfaces';

import { baseModule } from '../module';
import { Permissions } from '../permissions';

class GetModuleRolesRequest extends ExactProps<GetModuleRolesRequest> {
  @IsOptional()
  public readonly scope?: string;

  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetModuleRolesResponse = PaginatedCollection<RoleResponse>;

export const getModuleRolesApi: Api<
  GetModuleRolesRequest,
  GetModuleRolesResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/module-roles',
  validator: GetModuleRolesRequest,
  permission: Permissions.ReadRole,
});
