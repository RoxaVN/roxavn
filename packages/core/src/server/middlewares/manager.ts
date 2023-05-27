import { autoBind } from '../service/base.js';
import { serviceContainer } from '../service/container.js';
import { MiddlewareService } from './interfaces.js';

export function compose(middlewares: Array<MiddlewareService['handle']>) {
  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    async function dispatch(i: number): Promise<any> {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      const fn = middlewares[i];
      if (i === middlewares.length) {
        return await next();
      }
      return await fn(context, dispatch.bind(null, i + 1));
    }
  } as MiddlewareService['handle'];
}

@autoBind()
export class MiddlewareManager {
  static apiMiddlewareServices: Array<{
    new (...args: any[]): MiddlewareService;
  }> = [];
  static loaderMiddlewareServices: Array<{
    new (...args: any[]): MiddlewareService;
  }> = [];

  apiMiddlewares?: Array<MiddlewareService['handle']>;
  loaderMiddlewares?: Array<MiddlewareService['handle']>;

  async getApiMiddlewares() {
    if (this.apiMiddlewares) {
      return this.apiMiddlewares;
    }
    const middlewares = await this.loadMiddlewares(
      MiddlewareManager.apiMiddlewareServices
    );
    this.apiMiddlewares = middlewares;
    return middlewares;
  }

  async getLoaderMiddlewares() {
    if (this.loaderMiddlewares) {
      return this.loaderMiddlewares;
    }
    const middlewares = await this.loadMiddlewares(
      MiddlewareManager.loaderMiddlewareServices
    );
    this.loaderMiddlewares = middlewares;
    return middlewares;
  }

  private async loadMiddlewares(
    middlewareServices: Array<{ new (...args: any[]): MiddlewareService }>
  ) {
    const middlewares: Array<MiddlewareService> = await Promise.all(
      middlewareServices.map((service) => serviceContainer.getAsync(service))
    );
    middlewares.sort((a, b) => {
      if (a.dependencies?.includes(b.constructor as any)) {
        return -1;
      }
      return 1;
    });
    return middlewares.map((m) => m.handle.bind(m));
  }
}

export function useApiMiddleware() {
  return (serviceClass: { new (...args: any[]): MiddlewareService }) => {
    autoBind()(serviceClass);
    MiddlewareManager.apiMiddlewareServices.push(serviceClass);
  };
}

export function useLoaderMiddleware() {
  return (serviceClass: { new (...args: any[]): MiddlewareService }) => {
    autoBind()(serviceClass);
    MiddlewareManager.loaderMiddlewareServices.push(serviceClass);
  };
}
