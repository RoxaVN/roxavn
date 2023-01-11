import { Api, Empty, UnauthorizedException } from '@roxavn/core/share';
import { baseModule } from '../module';

export const logoutApi: Api<Empty, Empty, UnauthorizedException> =
  baseModule.api({
    method: 'POST',
    path: '/logout',
  });
