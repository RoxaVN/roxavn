import {
  Api,
  ApiError,
  ApiRequest,
  ApiResponse,
  Collection,
  Empty,
  PaginatedCollection,
  Resources,
} from './api';
import {
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from './errors';
import { BaseModule } from './module';

export type ApiOptions<
  Req extends ApiRequest = ApiRequest,
  Res extends ApiResponse = ApiResponse,
  Error extends ApiError = ApiError
> = Omit<Api<Req, Res, Error>, 'path' | 'resources' | 'method'> & {
  method?: Api['method'];
};

export class ApiSource<T extends ApiResponse> {
  constructor(public resources: Resources, private module: BaseModule) {}

  apiPath(options?: { includeId?: boolean }) {
    let result = this.module.apiPath('');
    this.resources.forEach((r, index) => {
      result += '/' + r.name;
      if (index !== this.resources.length - 1 || options?.includeId) {
        result += '/:' + r.idParam;
      }
    });
    return result;
  }

  getMany<
    Req extends ApiRequest = ApiRequest,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, PaginatedCollection<T>, Error> {
    return {
      method: 'GET',
      ...api,
      path: this.apiPath(),
      resources: this.resources,
    };
  }

  getAll<
    Req extends ApiRequest = ApiRequest,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, Collection<T>, Error> {
    return {
      method: 'GET',
      ...api,
      path: this.apiPath(),
      resources: this.resources,
    };
  }

  getOne<
    Req extends ApiRequest = ApiRequest,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, T, Error> {
    return {
      method: 'GET',
      ...api,
      path: this.apiPath({ includeId: true }),
      resources: this.resources,
    };
  }

  create<
    Req extends ApiRequest = ApiRequest,
    Res extends ApiResponse = { id: number },
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, Res, Error> {
    return {
      method: 'POST',
      ...api,
      path: this.apiPath(),
      resources: this.resources,
    };
  }

  createRelation<
    Req extends ApiRequest = ApiRequest,
    Res extends ApiResponse = Empty,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, Res, Error> {
    if (this.resources.length === 2) {
      return {
        method: 'POST',
        ...api,
        path: this.apiPath({ includeId: true }),
        resources: this.resources,
      };
    }
    throw new Error('Only create relation between 2 resource');
  }

  update<
    Req extends ApiRequest = ApiRequest,
    Res extends ApiResponse = Empty,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, Res, Error> {
    return {
      method: 'PUT',
      ...api,
      path: this.apiPath({ includeId: true }),
      resources: this.resources,
    };
  }

  delete<
    Req extends ApiRequest = ApiRequest,
    Res extends ApiResponse = Empty,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >(api: ApiOptions<Req>): Api<Req, Res, Error> {
    return {
      method: 'DELETE',
      ...api,
      path: this.apiPath({ includeId: true }),
      resources: this.resources,
    };
  }

  custom<
    Req extends ApiRequest,
    Res extends ApiResponse,
    Error extends ApiError
  >(api: ApiOptions<Req> & Pick<Api, 'method' | 'path'>): Api<Req, Res, Error> {
    return {
      ...api,
      resources: this.resources,
    };
  }
}
