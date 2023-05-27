import { RouterContext } from '../service/context.js';

export interface MiddlewareService {
  dependencies?: Array<{
    new (...args: any[]): MiddlewareService;
  }>;
  handle: (context: RouterContext, next: () => Promise<void>) => Promise<void>;
}
