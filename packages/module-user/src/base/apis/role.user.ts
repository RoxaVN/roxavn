import {
  accessManager,
  ApiSource,
  ExactProps,
  IsOptional,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';
import { scopes } from '../access';
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

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page = 1;
}

export const roleUserApi = {
  getMany: roleUserSource.getMany({
    validator: GetRoleUsersRequest,
    permission: accessManager.permissions.ReadRoleUsers,
  }),
};
