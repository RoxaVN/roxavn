import {
  BadRequestException,
  InferApiRequest,
  NotFoundException,
} from '@roxavn/core/base';
import { ApiService, moduleManager, serviceManager } from '@roxavn/core/server';
import { In } from 'typeorm';

import { userRoleApi } from '../../base';
import { Role, UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(userRoleApi.create)
export class CreateUserRoleApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userRoleApi.create>) {
    const role = await this.dbSession.getRepository(Role).findOne({
      where: { id: request.roleId },
      select: ['scope', 'module'],
    });
    if (!role) {
      throw new NotFoundException();
    }
    if (
      (request.module && role.module !== request.module) ||
      (request.scope && role.scope !== request.scope)
    ) {
      throw new BadRequestException();
    }

    const userRole = new UserRole();
    userRole.userId = request.userId;
    userRole.roleId = request.roleId;
    userRole.scope = role.scope;
    if (request.scopeId) {
      userRole.scopeId = request.scopeId;
    }
    await this.dbSession.save(userRole);
    return {};
  }
}

@serverModule.useApi(userRoleApi.delete)
export class DeleteUserRoleApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userRoleApi.delete>) {
    if (request.module || request.scope) {
      const isValid = await this.dbSession.getRepository(Role).count({
        where: {
          module: request.module,
          scope: request.scope,
          id: request.roleId,
        },
      });
      if (!isValid) {
        throw new BadRequestException();
      }
    }

    await this.dbSession.getRepository(UserRole).delete({
      scopeId: request.scopeId || '',
      userId: request.userId,
      roleId: request.roleId,
    });
    return {};
  }
}

@serverModule.useApi(userRoleApi.getAll)
export class GetUserRolesApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userRoleApi.getAll>) {
    // query must be same in authorization middleware to cache
    const items = await this.dbSession.getRepository(UserRole).find({
      relations: { role: true },
      select: {
        scopeId: true,
        role: {
          id: true,
          name: true,
          permissions: true,
          scope: true,
        },
      },
      where: {
        userId: request.userId,
        scopeId: request.scopeId || '',
        scope: request.scopes ? In(request.scopes) : request.scope,
      },
      cache: 30000, // 30 seconds
    });
    return {
      items: items.map((i) => ({ ...i.role, scopeId: i.scopeId })),
    };
  }
}

@serverModule.useApi(userRoleApi.modules)
export class GetUserRoleModulesApiService extends ApiService {
  handle(request: InferApiRequest<typeof userRoleApi.modules>) {
    return this.create(GetUserRolesApiService).handle({
      userId: request.userId,
      scopes: moduleManager.modules.map((m) => m.name),
    });
  }
}

const AbstractGetService = serviceManager.getUserScopeIdsApiService;
export class GetUserScopeIdsApiService extends AbstractGetService {
  async handle(request: {
    scope: string;
    userId: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.dbSession
      .getRepository(UserRole)
      .findAndCount({
        select: { scopeId: true, userId: true, roleId: true },
        where: {
          userId: request.userId,
          scope: request.scope,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}
serviceManager.getUserScopeIdsApiService = GetUserScopeIdsApiService;

const AbstractSetService = serviceManager.setUserRoleApiService;
export class SetUserRoleApiService extends AbstractSetService {
  async handle(request: {
    scope: string;
    scopeId: string;
    userId: string;
    roleName: string;
  }) {
    const role = await this.dbSession.getRepository(Role).findOne({
      select: ['id'],
      where: { scope: request.scope, name: request.roleName },
    });
    if (role) {
      const userRole = new UserRole();
      userRole.userId = request.userId;
      userRole.roleId = role.id;
      userRole.scope = request.scope;
      await this.dbSession.save(userRole);
      return {};
    }
    throw new NotFoundException();
  }
}
serviceManager.setUserRoleApiService = SetUserRoleApiService;
