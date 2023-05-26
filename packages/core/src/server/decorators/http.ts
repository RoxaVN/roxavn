import { constants } from '../constants.js';
import { ServerLoaderContext } from '../middlewares/index.js';

export function makeServerContextDecorator(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
  handler: (context: ServerLoaderContext) => any
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

export const RequestObject: ContextDecorator<Request> = (
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
