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

import { baseModule } from '../module';
import { Permissions } from '../permissions';

class GetStatsModuleRoleRequest extends ExactProps<GetStatsModuleRoleRequest> {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetStatsModuleRoleResponse = PaginatedCollection<{
  ownerId: number;
  rolesCount: number;
}>;

export const getStatsModuleRoleApi: Api<
  GetStatsModuleRoleRequest,
  GetStatsModuleRoleResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/module-role/stats',
  validator: GetStatsModuleRoleRequest,
  permission: Permissions.ReadUserRoles,
});
