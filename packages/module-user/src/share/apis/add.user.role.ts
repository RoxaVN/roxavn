import {
  Api,
  Empty,
  ExactProps,
  ForbiddenException,
  IsNumber,
  IsOptional,
  Min,
  UnauthorizedException,
} from '@roxavn/core/share';
import { Type } from 'class-transformer';

import { baseModule } from '../module';
import { Permissions } from '../permissions';

class AddUserRoleRequest extends ExactProps<AddUserRoleRequest> {
  @Min(1)
  @Type(() => Number)
  public readonly id: number;

  @IsNumber()
  public readonly roleId: number;

  @IsOptional()
  public readonly scopeId?: string;
}

export const addUserRoleApi: Api<
  AddUserRoleRequest,
  Empty,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'POST',
  path: '/user/:id/role',
  validator: AddUserRoleRequest,
  permission: Permissions.UpdateUserRoles,
});
