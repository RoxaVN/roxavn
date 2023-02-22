import {
  ApiSource,
  ExactProps,
  IsArray,
  IsOptional,
  Min,
  MinLength,
  TransformArray,
  TransformNumber,
} from '@roxavn/core/base';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';
import { RoleResponse } from './role';

const userRoleSource = new ApiSource<RoleResponse>(
  [Resources.User, Resources.Role],
  baseModule
);

class CreateUserRoleRequest extends ExactProps<CreateUserRoleRequest> {
  @MinLength(1)
  public readonly userId: string;

  @Min(1)
  @TransformNumber()
  public readonly roleId: number;

  @IsOptional()
  public readonly scopeId?: string;
}

class DeleteUserRoleRequest extends CreateUserRoleRequest {}

class GetUserRolesRequest extends ExactProps<GetUserRolesRequest> {
  @MinLength(1)
  public readonly userId: string;

  @IsArray()
  @TransformArray()
  @IsOptional()
  public readonly scopes?: string[];

  @IsOptional()
  public readonly scopeId?: string;
}

export const userRoleApi = {
  create: userRoleSource.createRelation({
    validator: CreateUserRoleRequest,
    permission: Permissions.CreateUserRole,
  }),
  delete: userRoleSource.delete({
    validator: DeleteUserRoleRequest,
    permission: Permissions.DeleteUserRole,
  }),
  getAll: userRoleSource.getAll({
    validator: GetUserRolesRequest,
    permission: Permissions.ReadUserRoles,
  }),
};
