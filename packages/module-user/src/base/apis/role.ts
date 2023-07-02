import {
  ApiSource,
  ExactProps,
  ForbiddenException,
  IsNumberString,
  IsOptional,
  Max,
  Min,
  PaginatedCollection,
  TransformArray,
  TransformNumber,
  UnauthorizedException,
} from '@roxavn/core/base';
import { Type } from 'class-transformer';
import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface RoleResponse {
  id: number;
  name: string;
  permissions: string[];
  scope: string;
  module: string;
  isPredefined: boolean;
}

const roleSource = new ApiSource<RoleResponse>([scopes.Role], baseModule);

class GetRolesRequest extends ExactProps<GetRolesRequest> {
  @IsNumberString({}, { each: true })
  @TransformArray()
  @IsOptional()
  public readonly ids?: number[];

  @IsOptional()
  public readonly scope?: string;

  // add field for DynamicModule
  @IsOptional()
  public readonly module?: string;

  @IsOptional()
  public readonly scopeText?: string;

  @IsOptional()
  public readonly scopeId?: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;

  @Min(10)
  @Max(50)
  @TransformNumber()
  @IsOptional()
  public readonly pageSize?: number;
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
    permission: permissions.ReadRoles,
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
