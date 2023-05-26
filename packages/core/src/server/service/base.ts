import { injectable } from 'inversify';
import { Api } from '../../base/index.js';
import { serviceContainer } from './container.js';

export type InferAuthApiRequest<T> = T extends Api<infer U, any, any>
  ? U & {
      $user: { id: string };
      $accessToken: { id: string };
    }
  : never;

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
