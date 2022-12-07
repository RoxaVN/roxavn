import {
  Api,
  ExactProps,
  ForbiddenException,
  Id,
  IsEmail,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/share';
import { UserExistsException } from '../interfaces';
import { Permissions } from '../permissions';

class CreateUserRequest extends ExactProps<CreateUserRequest> {
  @MinLength(1)
  public readonly name!: string;

  @IsEmail()
  public readonly email!: string;
}

interface CreateUserResponse extends Id {
  resetPasswordToken?: string;
}

export const CreateUserApi: Api<
  CreateUserRequest,
  CreateUserResponse,
  UnauthorizedException | ForbiddenException | UserExistsException
> = {
  method: 'POST',
  path: '/users',
  validator: CreateUserRequest,
  permission: Permissions.CreateUser,
};
