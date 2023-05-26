import { EntityManager } from 'typeorm';
import { AuthorizationArgs } from '../middlewares/authorize.js';
import { BaseService } from './base.js';
import { Empty, PaginatedCollection } from '../../base/api.js';

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

class CheckRoleUsersApiService extends BaseService {
  handle(request: {
    scope: string;
    scopeId: string;
    userIds: string[];
  }): Promise<{ success: boolean }> {
    throw new Error(
      "CheckRoleUsersApiService isn't implemented " + JSON.stringify(request)
    );
  }
}

export const serviceManager = {
  checkUserPermission: (
    dbSession: EntityManager,
    ...args: Parameters<AuthorizationArgs['helper']['hasPermission']>
  ): Promise<boolean> => {
    throw new Error(
      "checkUserPermission isn't implemented " +
        JSON.stringify({ dbSession, args })
    );
  },
  getUserScopeIdsApiService: GetUserScopeIdsApiService,
  setUserRoleApiService: SetUserRoleApiService,
  checkRoleUsersApiService: CheckRoleUsersApiService,
};
