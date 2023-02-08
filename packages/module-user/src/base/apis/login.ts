import {
  Api,
  ExactProps,
  MinLength,
  UnauthorizedException,
} from '@roxavn/core/base';
import { baseModule } from '../module';

class LoginRequest extends ExactProps<LoginRequest> {
  @MinLength(1)
  public readonly username!: string;

  @MinLength(1)
  public readonly password!: string;
}

interface LoginResponse {
  accessToken: string;
}

export const loginApi: Api<LoginRequest, LoginResponse, UnauthorizedException> =
  baseModule.api({
    method: 'POST',
    path: '/login',
    auth: 'NOT_LOGGED',
    validator: LoginRequest,
  });
