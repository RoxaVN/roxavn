import { autoBind } from '../services/base.js';
import { serviceContainer } from '../services/container.js';
import { MiddlewareService } from './interfaces.js';

export function compose(middlewares: Array<MiddlewareService['handle']>) {
  return function (context: any, next?: MiddlewareService['handle']) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    function dispatch(i: number): any {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;
      let fn: any = middlewares[i];
      if (i === middlewares.length) {
        fn = next;
      }
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
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
      if (
        a.after?.includes(b.constructor as any) ||
        b.before?.includes(a.constructor as any)
      ) {
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
