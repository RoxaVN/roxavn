import { EntityManager } from 'typeorm';
import { Api, InferApiRequest, InferApiResponse } from '../base';

export type AuthenticatedData = {
  $user: { id: string };
  $accessToken: { id: string };
  $getResource: () => Promise<Record<string, any> | null>;
};

export type InferAuthApiRequest<T> = T extends Api<infer U, any, any>
  ? U & AuthenticatedData
  : never;

export abstract class BaseService<Request = any, Response = any> {
  constructor(public dbSession: EntityManager) {}

  abstract handle(request: Request): Promise<Response> | Response;

  create<Req, Resp>(classType: new (...args: any[]) => BaseService<Req, Resp>) {
    return new classType(this.dbSession);
  }
}

export abstract class ApiService<T extends Api = Api> extends BaseService<
  InferApiRequest<T>,
  InferApiResponse<T>
> {
  auth?: (req: InferAuthApiRequest<T>) => Promise<boolean>;
}

export abstract class AuthApiService<T extends Api = Api> extends BaseService<
  InferApiRequest<T> & AuthenticatedData,
  InferApiResponse<T>
> {}
