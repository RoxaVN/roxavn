import { injectable } from 'inversify';
import { serviceContainer } from './container.js';

@autoBind()
export abstract class BaseService<Request = any, Response = any> {
  abstract handle(request: Request, ...args: any[]): Promise<Response>;
}

export function autoBind() {
  return (constructor: any) => {
    if (!serviceContainer.isBound(constructor)) {
      injectable()(constructor);
      serviceContainer.bind(constructor).toSelf();
    }
  };
}

export function rebind(source: any) {
  return (constructor: any) => {
    autoBind()(constructor);
    serviceContainer
      .rebind(source)
      .toDynamicValue(() => serviceContainer.getAsync(constructor));
  };
}

export function bindFactory() {
  return (target: any, propertyKey: string) => {
    serviceContainer.bind(target).toDynamicValue((context) => {
      return target[propertyKey](context);
    });
  };
}
