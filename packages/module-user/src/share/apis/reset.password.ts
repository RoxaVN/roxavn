import {
  Api,
  BadRequestException,
  Empty,
  ExactProps,
  ForbiddenException,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/share';
import { baseModule } from '../module';

class ResetPasswordRequest extends ExactProps<ResetPasswordRequest> {
  @MinLength(1)
  public readonly username!: string;

  @MinLength(1)
  public readonly token!: string;

  @MinLength(8)
  public readonly password!: string;
}

export const resetPasswordApi: Api<
  ResetPasswordRequest,
  Empty,
  BadRequestException | UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'POST',
  path: '/reset-password',
  auth: 'NOT_LOGGED',
  validator: ResetPasswordRequest,
});
