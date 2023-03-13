import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';

import { Api } from '../../base';

export type MiddlewareContext = {
  req: Request;
  resp: Response;
  dbSession: EntityManager;
};

export type ApiMiddleware = (
  api: Api,
  context: MiddlewareContext
) => Promise<void>;
