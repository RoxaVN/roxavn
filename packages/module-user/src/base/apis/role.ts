import {
  accessManager,
  ApiSource,
  ExactProps,
  ForbiddenException,
  IsNumberString,
  IsOptional,
  Min,
  PaginatedCollection,
  TransformArray,
  TransformNumber,
  UnauthorizedException,
} from '@roxavn/core/base';
import { Type } from 'class-transformer';
import { baseModule } from '../module';
import { permissions, scopes } from '../access';

export interface RoleResponse {
  id: number;
  name: string;
  permissions: string[];
  scope: string;
}

const roleSource = new ApiSource<RoleResponse>([scopes.Role], baseModule);

class GetRolesRequest extends ExactProps<GetRolesRequest> {
  @IsNumberString({}, { each: true })
  @TransformArray()
  @IsOptional()
  public readonly ids?: number[];

  @IsOptional()
  public readonly scope?: string;

  @IsOptional()
  public readonly scopeText?: string;

  @IsOptional()
  public readonly scopeId?: string;

  @Min(1)
  @TransformNumber()
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
  getMany: roleSource.getMany({
    validator: GetRolesRequest,
    permission: accessManager.permissions.ReadRoles,
  }),
  moduleStats: roleSource.custom<
    GetModuleRolStatseRequest,
    GetModuleRoleStatsResponse,
    UnauthorizedException | ForbiddenException
  >({
    path: roleSource.apiPath() + '/module/stats',
    method: 'GET',
    permission: permissions.ReadUserRoles,
    validator: GetModuleRolStatseRequest,
  }),
};
