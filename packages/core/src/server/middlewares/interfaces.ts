import { type EntityManager } from 'typeorm';

import { Api } from '../../base';

export interface IRequest {
  params: any;
  query: any;
  headers: Request['headers'];
  body: any;
  readonly ip: string;
  readonly ips?: string[];
  readonly hostname: string;
  readonly url: string;
  readonly protocol: 'http' | 'https';
  readonly method: string;
}

export interface IResponse {
  status: (statusCode: number) => IResponse;
  send: (payload: any) => IResponse;
}

export type MiddlewareContext = {
  request: IRequest;
  response: IResponse;
  dbSession: EntityManager;
  state: Record<string, any>;
  api?: Api;
};

export type ServerMiddleware = (context: MiddlewareContext) => Promise<void>;
