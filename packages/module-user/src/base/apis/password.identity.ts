import {
  ApiSource,
  BadRequestException,
  Empty,
  ExactProps,
  ForbiddenException,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/base';
import { baseModule } from '../module';
import { Resources } from '../roles';

const passwordIdentitySource = new ApiSource<{
  id: number;
  userId: number;
  createdDate: Date;
  updatedDate: Date;
  expiredDate: Date;
}>([Resources.PasswordIdentity], baseModule);

class AuthRequest extends ExactProps<AuthRequest> {
  @MinLength(1)
  public readonly username!: string;

  @MinLength(1)
  public readonly password!: string;
}

class ResetPasswordRequest extends ExactProps<ResetPasswordRequest> {
  @MinLength(1)
  public readonly username!: string;

  @MinLength(1)
  public readonly token!: string;

  @MinLength(8)
  public readonly password!: string;
}

export const passwordIdentityApi = {
  auth: passwordIdentitySource.custom<
    AuthRequest,
    { id: number; userId: number; accessToken: string },
    UnauthorizedException
  >({
    method: 'POST',
    path: passwordIdentitySource.apiPath() + '/auth',
    validator: AuthRequest,
  }),
  reset: passwordIdentitySource.custom<
    ResetPasswordRequest,
    Empty,
    BadRequestException | UnauthorizedException | ForbiddenException
  >({
    method: 'POST',
    path: passwordIdentitySource.apiPath() + '/reset',
    validator: ResetPasswordRequest,
  }),
};
