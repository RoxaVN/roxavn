import {
  ApiSource,
  ExactProps,
  ForbiddenException,
  IsNumberString,
  IsOptional,
  Min,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/base';
import { Type } from 'class-transformer';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

export interface RoleResponse {
  id: number;
  name: string;
  permissions: string[];
  scope: string;
}

const roleSource = new ApiSource<RoleResponse>([Resources.Role], baseModule);

class GetModuleRolesRequest extends ExactProps<GetModuleRolesRequest> {
  @IsNumberString({}, { each: true })
  @IsOptional()
  public readonly ids?: number[];

  @IsOptional()
  public readonly scope?: string;

  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

class GetModuleRolStatseRequest extends ExactProps<GetModuleRolStatseRequest> {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetModuleRoleStatsResponse = PaginatedCollection<{
  userId: string;
  rolesCount: number;
}>;

export const roleApi = {
  moduleRoles: roleSource.custom<
    GetModuleRolesRequest,
    PaginatedCollection<RoleResponse>,
    UnauthorizedException | ForbiddenException
  >({
    path: roleSource.apiPath() + '/module',
    method: 'GET',
    permission: Permissions.ReadRoles,
    validator: GetModuleRolesRequest,
  }),
  moduleStats: roleSource.custom<
    GetModuleRolStatseRequest,
    GetModuleRoleStatsResponse,
    UnauthorizedException | ForbiddenException
  >({
    path: roleSource.apiPath() + '/module/stats',
    method: 'GET',
    permission: Permissions.ReadUserRoles,
    validator: GetModuleRolStatseRequest,
  }),
};
