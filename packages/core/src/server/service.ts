import { DataSource } from 'typeorm';
import { Api, InferApiRequest, InferApiResponse } from '../share';

export abstract class BaseService<Request, Response> {
  constructor(public dataSource: DataSource) {}

  abstract handle(request: Request): Promise<Response> | Response;
}

export abstract class ApiService<T extends Api> extends BaseService<
  InferApiRequest<T>,
  InferApiResponse<T>
> {}
