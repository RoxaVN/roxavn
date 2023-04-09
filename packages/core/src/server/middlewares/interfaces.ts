import { type EntityManager } from 'typeorm';

import { Api } from '../../base';

export interface ServerLoaderContext {
  getRequestData: () => Record<string, any>;
  getClientIp: () => string;
}

export interface ServerLoaderArgs {
  request: Request;
  dbSession: EntityManager;
  state: Record<string, any>;
  api?: Api;
  context: ServerLoaderContext;
}

export type ServerMiddleware = (args: ServerLoaderArgs) => Promise<void>;
