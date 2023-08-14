import { Empty } from './api.js';
import { urlUtils } from './url.js';

export class WebRoute<
  Params extends Record<string, any> = Empty,
  Query extends Record<string, any> = Empty
> {
  constructor(readonly path: string) {}

  generate(data: Params & Query) {
    const { path, params } = urlUtils.generatePath(this.path, data);
    return `${path}?${new URLSearchParams(params)}`;
  }
}

export const webRoutes = {
  Login: new WebRoute<Empty, { ref?: string }>('/login'),
  Register: new WebRoute<Empty, { ref?: string }>('/register'),
  Me: new WebRoute('/me'),
  Admin: new WebRoute('/admin/apps'),
  Apps: new WebRoute('/apps'),
  Home: new WebRoute('/'),
};
