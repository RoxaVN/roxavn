import { Api, Empty, UnauthorizedException } from '@roxavn/core/share';

export const LogoutApi: Api<Empty, Empty, UnauthorizedException> = {
  method: 'POST',
  path: '/logout',
};
