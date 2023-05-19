import { InferApiRequest } from '@roxavn/core/base';
import { ApiService, serviceManager } from '@roxavn/core/server';
import { ILike, In } from 'typeorm';

import { roleUserApi } from '../../base/index.js';
import { UserRole } from '../entities/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(roleUserApi.getMany)
export class GetRoleUsersApiService extends ApiService {
  async handle(request: InferApiRequest<typeof roleUserApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;
    let filterRole;
    if (request.module) {
      filterRole = { module: request.module };
    }

    const [items, totalItems] = await this.dbSession
      .getRepository(UserRole)
      .findAndCount({
        relations: { user: true },
        select: {
          user: {
            id: true,
            username: true,
            createdDate: true,
            updatedDate: true,
          },
        },
        where: {
          roleId: request.roleId,
          scopeId: request.scopeId || '',
          scope: request.scope,
          role: filterRole,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });
    return {
      items: items.map((i) => i.user),
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(roleUserApi.search)
export class SearchRoleUsersApiService extends ApiService {
  async handle(request: InferApiRequest<typeof roleUserApi.search>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.dbSession
      .getRepository(UserRole)
      .findAndCount({
        relations: { user: true },
        select: {
          user: {
            id: true,
            username: true,
            createdDate: true,
            updatedDate: true,
          },
        },
        where: {
          user: request.usernameText
            ? {
                username: ILike(request.usernameText + '%'),
              }
            : undefined,
          scopeId: request.scopeId || '',
          scope: request.scope,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });
    return {
      items: items.map((i) => i.user),
      pagination: { page, pageSize, totalItems },
    };
  }
}

const AbstractCheckRoleUsersApiService =
  serviceManager.checkRoleUsersApiService;
export class CheckRoleUsersApiService extends AbstractCheckRoleUsersApiService {
  async handle(request: { scope: string; scopeId: string; userIds: string[] }) {
    const count = await this.dbSession.getRepository(UserRole).count({
      where: {
        scopeId: request.scopeId,
        scope: request.scope,
        userId: In(request.userIds),
      },
    });

    return {
      success: count === request.userIds.length,
    };
  }
}
serviceManager.checkRoleUsersApiService = CheckRoleUsersApiService;
