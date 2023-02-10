import {
  Api,
  Empty,
  ExactProps,
  ForbiddenException,
  IsNumber,
  IsOptional,
  Min,
  UnauthorizedException,
} from '@roxavn/core/base';
import { Type } from 'class-transformer';

import { baseModule } from '../module';
import { Permissions } from '../roles';

class DeleteUserRoleRequest extends ExactProps<DeleteUserRoleRequest> {
  @Min(1)
  @Type(() => Number)
  public readonly id: number;

  @IsNumber()
  public readonly roleId: number;

  @IsOptional()
  public readonly resourceId?: string;
}

export const deleteUserRoleApi: Api<
  DeleteUserRoleRequest,
  Empty,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'DELETE',
  path: '/user/:id/role',
  validator: DeleteUserRoleRequest,
  permission: Permissions.UpdateUserRoles,
});
