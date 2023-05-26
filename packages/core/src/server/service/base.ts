import { injectable } from 'inversify';
import { serviceContainer } from './container.js';

@autoBind()
export abstract class BaseService<Request = any, Response = any> {
  abstract handle(request: Request, ...args: any[]): Promise<Response>;
}

export function autoBind() {
  return (constructor: any) => {
    injectable()(constructor);
    serviceContainer.bind(constructor).toSelf();
  };
}

export function rebind(source: any) {
  return (constructor: any) => {
    serviceContainer.rebind(source).toConstructor(constructor);
  };
}
