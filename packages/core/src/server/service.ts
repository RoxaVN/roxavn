import { EntityManager } from 'typeorm';
import { Api, InferApiRequest, InferApiResponse } from '../share';

export abstract class BaseService<Request, Response> {
  constructor(public dbSession: EntityManager) {}

  abstract handle(request: Request): Promise<Response> | Response;

  create<Req, Resp>(classType: new (...args: any[]) => BaseService<Req, Resp>) {
    return new classType(this.dbSession);
  }
}

export abstract class ApiService<T extends Api> extends BaseService<
  InferApiRequest<T>,
  InferApiResponse<T>
> {}
