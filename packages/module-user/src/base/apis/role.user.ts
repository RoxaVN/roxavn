import {
  accessManager,
  ApiSource,
  ExactProps,
  IsOptional,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';
import { permissions, scopes } from '../access';
import { baseModule } from '../module';
import { UserResponse } from './user';

const roleUserSource = new ApiSource<UserResponse>(
  [scopes.Role, accessManager.scopes.User],
  baseModule
);

class GetRoleUsersRequest extends ExactProps<GetRoleUsersRequest> {
  @Min(1)
  @TransformNumber()
  public readonly roleId: number;

  @MinLength(1)
  @IsOptional()
  public readonly scopeId?: string;

  // add field for DynamicModule
  @IsOptional()
  public readonly module?: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;
}

export const roleUserApi = {
  getMany: roleUserSource.getMany({
    validator: GetRoleUsersRequest,
    permission: permissions.ReadRoleUsers,
  }),
};