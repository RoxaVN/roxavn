import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { In } from 'typeorm';

import { userRoleApi } from '../../base';
import { UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(userRoleApi.create)
export class CreateUserRoleApiService extends ApiService<
  typeof userRoleApi.create
> {
  async handle(request: InferApiRequest<typeof userRoleApi.create>) {
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
export class DeleteUserRoleApiService extends ApiService<
  typeof userRoleApi.delete
> {
  async handle(request: InferApiRequest<typeof userRoleApi.delete>) {
    await this.dbSession.getRepository(UserRole).delete({
      scopeId: request.scopeId || '',
      userId: request.userId,
      roleId: request.roleId,
    });
  }
}

@serverModule.useApi(userRoleApi.getAll)
export class GetUserRolesApiService extends ApiService<
  typeof userRoleApi.getAll
> {
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
        scopeId: request.scopeId,
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
