import { RouterContext } from '../services/context.js';

export interface MiddlewareService {
  after?: Array<{
    new (...args: any[]): MiddlewareService;
  }>;
  before?: Array<{
    new (...args: any[]): MiddlewareService;
  }>;
  handle: (context: RouterContext, next: () => Promise<void>) => Promise<void>;
}

export type MiddlewareServiceClass = {
  new (...args: any[]): MiddlewareService;
};
