import { ServerException } from '../../base';
import { MiddlewareContext } from './interfaces';

export type ErrorMiddleware = (
  error: any,
  context: MiddlewareContext
) => Promise<void> | void;

export const serverErrorMiddleware: ErrorMiddleware = async (
  error,
  { response }
) => {
  if (!error.code || !error.toJson) {
    error = new ServerException();
  }
  response.status(error.code).send({ code: error.code, error: error.toJson() });
};
