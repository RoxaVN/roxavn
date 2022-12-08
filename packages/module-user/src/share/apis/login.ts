import {
  Api,
  ExactProps,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/share';

class LoginRequest extends ExactProps<LoginRequest> {
  @MinLength(1)
  public readonly username!: string;

  @MinLength(1)
  public readonly password!: string;
}

interface LoginResponse {
  accessToken: string;
}

export const LoginApi: Api<LoginRequest, LoginResponse, UnauthorizedException> =
  {
    method: 'POST',
    path: '/login',
    auth: 'NOT_LOGGED',
    validator: LoginRequest,
  };
