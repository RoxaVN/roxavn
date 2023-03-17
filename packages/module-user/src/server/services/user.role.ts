import { BadRequestException, InferApiRequest } from '@roxavn/core/base';
import { ApiService, moduleManager } from '@roxavn/core/server';
import { In } from 'typeorm';

import { userRoleApi } from '../../base';
import { Role, UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(userRoleApi.create)
export class CreateUserRoleApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userRoleApi.create>) {
    if (request.module) {
      const isValid = await this.dbSession
        .getRepository(Role)
        .count({ where: { module: request.module, id: request.roleId } });
      if (!isValid) {
        throw new BadRequestException();
      }
    }

    const userRole = new UserRole();
    userRole.userId = request.userId;
    userRole.roleId = request.roleId;
    if (request.scopeId) {
      userRole.scopeId = request.scopeId;
    }
    await this.dbSession.save(userRole);
  }
}

@serverModule.useApi(userRoleApi.delete)
export class DeleteUserRoleApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userRoleApi.delete>) {
    if (request.module) {
      const isValid = await this.dbSession
        .getRepository(Role)
        .count({ where: { module: request.module, id: request.roleId } });
      if (!isValid) {
        throw new BadRequestException();
      }
    }

    await this.dbSession.getRepository(UserRole).delete({
      scopeId: request.scopeId || '',
      userId: request.userId,
      roleId: request.roleId,
    });
  }
}

@serverModule.useApi(userRoleApi.getAll)
export class GetUserRolesApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userRoleApi.getAll>) {
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
        role: request.scopes?.length
          ? {
              scope: In(request.scopes),
            }
          : undefined,
      },
    });
    return { items: items.map((i) => i.role) };
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
