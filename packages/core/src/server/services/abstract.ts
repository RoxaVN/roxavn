import { BaseService, autoBind } from './base.js';
import { Role, Empty, PaginatedCollection } from '../../base/index.js';
import { inject, interfaces } from 'inversify';

export type ServiceFactory = (context: interfaces.Context) => Promise<any>;

@autoBind()
export abstract class GetUserScopeIdsApiService extends BaseService {
  abstract handle(request: {
    scope: string;
    userId: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedCollection<{ scopeId: string }>>;
}

@autoBind()
export abstract class SetUserRoleApiService extends BaseService {
  abstract handle(request: {
    scope: string;
    scopeId: string;
    userId: string;
    roleName: string;
  }): Promise<Empty>;
}

@autoBind()
export abstract class CheckRoleUsersApiService extends BaseService {
  abstract handle(request: {
    scope: string;
    scopeId: string;
    userIds: string[];
  }): Promise<{ success: boolean }>;
}

@autoBind()
export abstract class CreateRoleService extends BaseService {
  abstract handle(request: Record<string, Role>): Promise<void>;
}

@autoBind()
export abstract class SetAdminRoleService extends BaseService {
  abstract handle(request: Role): Promise<void>;
}

@autoBind()
export abstract class BaseInstallHook extends BaseService {
  constructor(
    @inject(CreateRoleService) protected createRoleService: CreateRoleService,
    @inject(SetAdminRoleService)
    protected setAdminRoleService: SetAdminRoleService
  ) {
    super();
  }
}

@autoBind()
export abstract class CheckUserPermissionService extends BaseService {
  abstract handle(request: {
    userId: string;
    permission: string;
    scopes: Array<{ name: string; id?: string }>;
  }): Promise<boolean>;
}
