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
  path?: Api['path'];
};

export class ApiSource<T extends ApiResponse> {
  constructor(public resources: Resources, private module: BaseModule) {}

  apiPath(options?: { includeId?: boolean }) {
    let result = this.module.apiPath('');
    this.resources.forEach((r, index) => {
      result += '/' + r.pluralName;
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
  >({
    path,
    method,
    ...api
  }: ApiOptions<Req>): Api<Req, PaginatedCollection<T>, Error> {
    return {
      method: method || 'GET',
      path: path || this.apiPath(),
      ...api,
      resources: this.resources,
    };
  }

  getAll<
    Req extends ApiRequest = ApiRequest,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >({ method, path, ...api }: ApiOptions<Req>): Api<Req, Collection<T>, Error> {
    return {
      method: method || 'GET',
      path: path || this.apiPath(),
      ...api,
      resources: this.resources,
    };
  }

  getOne<
    Req extends ApiRequest = ApiRequest,
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >({ method, path, ...api }: ApiOptions<Req>): Api<Req, T, Error> {
    return {
      method: method || 'GET',
      path: path || this.apiPath({ includeId: true }),
      ...api,
      resources: this.resources,
    };
  }

  create<
    Req extends ApiRequest = ApiRequest,
    Res extends ApiResponse = { id: string },
    Error extends ApiError =
      | NotFoundException
      | ForbiddenException
      | UnauthorizedException
  >({ method, path, ...api }: ApiOptions<Req>): Api<Req, Res, Error> {
    return {
      method: method || 'POST',
      path: path || this.apiPath(),
      ...api,
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
  >({ method, path, ...api }: ApiOptions<Req>): Api<Req, Res, Error> {
    if (this.resources.length === 2) {
      return {
        method: method || 'POST',
        path: path || this.apiPath({ includeId: true }),
        ...api,
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
  >({ method, path, ...api }: ApiOptions<Req>): Api<Req, Res, Error> {
    return {
      method: method || 'PUT',
      path: path || this.apiPath({ includeId: true }),
      ...api,
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
  >({ method, path, ...api }: ApiOptions<Req>): Api<Req, Res, Error> {
    return {
      method: method || 'DELETE',
      path: path || this.apiPath({ includeId: true }),
      ...api,
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
