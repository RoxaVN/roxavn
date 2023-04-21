import { EntityManager } from 'typeorm';
import {
  Api,
  Empty,
  InferApiRequest,
  InferApiResponse,
  PaginatedCollection,
} from '../base';

export type InferAuthApiRequest<T> = T extends Api<infer U, any, any>
  ? U & {
      $user: { id: string };
      $accessToken: { id: string };
    }
  : never;

export abstract class BaseService<Request = any, Response = any> {
  constructor(public dbSession: EntityManager) {}

  abstract handle(request: Request): Promise<Response>;

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
  InferAuthApiRequest<T>,
  InferApiResponse<T>
> {}

class GetUserScopeIdsApiService extends BaseService {
  handle(request: {
    scope: string;
    userId: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedCollection<{ scopeId: string }>> {
    throw new Error(
      "GetUserScopeIdsApiService isn't implemented " + JSON.stringify(request)
    );
  }
}

class SetUserRoleApiService extends BaseService {
  handle(request: {
    scope: string;
    scopeId: string;
    userId: string;
    roleName: string;
  }): Promise<Empty> {
    throw new Error(
      "SetUserRoleApiService isn't implemented " + JSON.stringify(request)
    );
  }
}

export const serviceManager = {
  getUserScopeIdsApiService: GetUserScopeIdsApiService,
  setUserRoleApiService: SetUserRoleApiService,
};
