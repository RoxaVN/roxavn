import { Empty, WebRoute } from '@roxavn/core/base';

export const WebRoutes = {
  ResetPassword: new WebRoute<
    Empty,
    { username: string; token: string; ref?: string }
  >('/reset-password'),
  Login: new WebRoute<Empty, { ref?: string }>('/login'),
  Me: new WebRoute('/me'),
  Home: new WebRoute('/'),
};

WebRoutes as Record<string, WebRoute>;
