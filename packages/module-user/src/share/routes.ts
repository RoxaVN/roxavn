import { WebRoute } from '@roxavn/core/share';

export const Routes = {
  ResetPassword: { path: '/reset-password', isInternal: true },
  Login: { path: '/login', isInternal: true },
  Me: { path: '/me', isInternal: true },
  Home: { path: '/', isInternal: true },
};

Routes as Record<string, WebRoute>;
