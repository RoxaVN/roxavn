import {
  Api,
  ExactProps,
  ForbiddenException,
  Id,
  MaxLength,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/share';
import { UserExistsException } from '../errors';
import { baseModule } from '../module';
import { Permissions } from '../permissions';
import { IsUsername } from '../validation';

class CreateUserRequest extends ExactProps<CreateUserRequest> {
  @IsUsername()
  @MinLength(6)
  @MaxLength(32)
  public readonly username!: string;
}

interface CreateUserResponse extends Id {
  resetPasswordToken: string;
}

export const createUserApi: Api<
  CreateUserRequest,
  CreateUserResponse,
  UnauthorizedException | ForbiddenException | UserExistsException
> = baseModule.api({
  method: 'POST',
  path: '/users',
  validator: CreateUserRequest,
  permission: Permissions.CreateUser,
});
