import { WebRoute } from '@roxavn/core/share';

export const Routes = {
  ResetPassword: { path: '/reset-password' },
  Login: { path: '/login' },
  Me: { path: '/me' },
  Home: { path: '/' },
};

Routes as Record<string, WebRoute>;
