import { type EntityManager } from 'typeorm';

import { Api, Resource } from '../../base';

export interface RemixLoaderContextHelper {
  getRequestData: () => Record<string, any>;
  getClientIp: () => string;
}

export interface ServerLoaderContextHelper extends RemixLoaderContextHelper {
  getResourceInstance: () => Promise<Record<string, any> | null>;
  getRelatedResourceInstance: (
    resource: Resource
  ) => Promise<Record<string, any> | null>;
}

export interface ServerLoaderContext {
  request: Request;
  dbSession: EntityManager;
  state: Record<string, any>;
  api?: Api;
  helper: ServerLoaderContextHelper;
}

export type ServerMiddleware = (context: ServerLoaderContext) => Promise<void>;
