import { Api } from '../../base/api.js';
import { constants } from '../constants.js';
import { serviceContainer } from './container.js';

export interface RemixLoaderContextHelper {
  getRequestData: () => Record<string, any>;
  getClientIp: () => string;
}

export interface RouterContext {
  request: Request;
  state: Record<string, any>;
  api?: Api;
  helper: RemixLoaderContextHelper;
}

export async function handleService(serviceClass: any, context: RouterContext) {
  const service: any = await serviceContainer.getAsync(serviceClass);
  const params = [context.state.request];
  Reflect.getOwnMetadata(
    constants.API_CONTEXT_METADATA_KEY,
    serviceClass,
    'handle'
  )?.map((handler: any, index: number) => {
    if (handler) {
      params[index] = handler(context);
    }
  });
  return await service.handle(...params);
}

export function makeServerContextDecorator(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
  handler: (context: RouterContext) => any
) {
  const existingParameters: any[] =
    Reflect.getOwnMetadata(
      constants.API_CONTEXT_METADATA_KEY,
      target.constructor,
      propertyKey
    ) || [];
  existingParameters[parameterIndex] = handler;

  Reflect.defineMetadata(
    constants.API_CONTEXT_METADATA_KEY,
    existingParameters,
    target.constructor,
    propertyKey
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ContextDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number
) => void;

export type InferContext<T> = T extends ContextDecorator<infer U> ? U : never;

export const Ip: ContextDecorator<string> = (
  target,
  propertyKey,
  parameterIndex
) => {
  makeServerContextDecorator(target, propertyKey, parameterIndex, (context) => {
    return context.helper.getClientIp();
  });
};

export const UserAgent: ContextDecorator<string | null> = (
  target,
  propertyKey,
  parameterIndex
) => {
  makeServerContextDecorator(target, propertyKey, parameterIndex, (context) => {
    return context.request.headers.get('user-agent');
  });
};

export const RawRequest: ContextDecorator<Request> = (
  target,
  propertyKey,
  parameterIndex
) => {
  makeServerContextDecorator(target, propertyKey, parameterIndex, (context) => {
    return context.request;
  });
};

export const AuthUser: ContextDecorator<{ id: string }> = (
  target,
  propertyKey,
  parameterIndex
) => {
  makeServerContextDecorator(target, propertyKey, parameterIndex, (context) => {
    return context.state.$user;
  });
};

export const AuthAcesstoken: ContextDecorator<{ id: string }> = (
  target,
  propertyKey,
  parameterIndex
) => {
  makeServerContextDecorator(target, propertyKey, parameterIndex, (context) => {
    return context.state.$accessToken;
  });
};
