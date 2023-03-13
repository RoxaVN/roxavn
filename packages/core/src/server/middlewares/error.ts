import { NextFunction } from 'express';

import { ServerException } from '../../base';
import { MiddlewareContext } from './interfaces';

export type ErrorMiddleware = (
  error: any,
  context: MiddlewareContext,
  next: NextFunction
) => Promise<void> | void;

export const serverErrorMiddleware: ErrorMiddleware = async (
  error,
  { resp },
  next // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (!error.code || !error.toJson) {
    error = new ServerException();
  }
  resp.status(error.code).json({ code: error.code, error: error.toJson() });
};
