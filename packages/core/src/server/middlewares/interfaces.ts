import { type EntityManager } from 'typeorm';

import { Api } from '../../base';

export interface ServerLoaderContextHelper {
  getRequestData: () => Record<string, any>;
  getClientIp: () => string;
}

export interface ServerLoaderContext {
  request: Request;
  dbSession: EntityManager;
  state: Record<string, any>;
  api?: Api;
  helper: ServerLoaderContextHelper;
}

export type ServerMiddleware = (context: ServerLoaderContext) => Promise<void>;
