import {
  Api,
  BadRequestException,
  Empty,
  ExactProps,
  ForbiddenException,
  IsEmail,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/share';

class ResetPasswordRequest extends ExactProps<ResetPasswordRequest> {
  @IsEmail()
  public readonly email!: string;

  @MinLength(1)
  public readonly token!: string;

  @MinLength(8)
  public readonly password!: string;
}

export const ResetPasswordApi: Api<
  ResetPasswordRequest,
  Empty,
  BadRequestException | UnauthorizedException | ForbiddenException
> = {
  method: 'POST',
  path: '/reset-password',
  auth: 'NOT_LOGGED',
  validator: ResetPasswordRequest,
};
