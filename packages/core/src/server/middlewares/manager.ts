import { autoBind } from '../services/base.js';
import { serviceContainer } from '../services/container.js';
import { MiddlewareService, MiddlewareServiceClass } from './interfaces.js';

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
class BaseMiddlewareManager {
  static middlewareServices: Array<MiddlewareServiceClass> = [];

  middlewares?: Array<MiddlewareService['handle']>;

  async getMiddlewares() {
    if (this.middlewares) {
      return this.middlewares;
    }
    const middlewares = await this.loadMiddlewares(
      (this.constructor as any).middlewareServices
    );
    this.middlewares = middlewares;
    return middlewares;
  }

  private async loadMiddlewares(
    middlewareServices: Array<MiddlewareServiceClass>
  ) {
    const middlewares: Array<MiddlewareService> = await Promise.all(
      middlewareServices.map((service) => serviceContainer.getAsync(service))
    );
    middlewares.sort((a, b) => {
      if (
        a.after?.includes(b.constructor as any) ||
        b.before?.includes(a.constructor as any)
      ) {
        return 1;
      } else if (
        b.after?.includes(a.constructor as any) ||
        a.before?.includes(b.constructor as any)
      ) {
        return 1;
      }
      return 0;
    });
    return middlewares.map((m) => m.handle.bind(m));
  }
}

@autoBind()
export class ApiMiddlewareManager extends BaseMiddlewareManager {
  static middlewareServices: Array<MiddlewareServiceClass> = [];
}

@autoBind()
export class LoaderMiddlewareManager extends BaseMiddlewareManager {
  static middlewareServices: Array<MiddlewareServiceClass> = [];
}

export function useApiMiddleware() {
  return (serviceClass: MiddlewareServiceClass) => {
    autoBind()(serviceClass);
    ApiMiddlewareManager.middlewareServices.push(serviceClass);
  };
}

export function useLoaderMiddleware() {
  return (serviceClass: MiddlewareServiceClass) => {
    autoBind()(serviceClass);
    LoaderMiddlewareManager.middlewareServices.push(serviceClass);
  };
}
