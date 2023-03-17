import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { roleUserApi } from '../../base';
import { UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(roleUserApi.getMany)
export class GetUserRolesApiService extends ApiService {
  async handle(request: InferApiRequest<typeof roleUserApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.dbSession
      .getRepository(UserRole)
      .findAndCount({
        relations: { user: true },
        select: {
          scopeId: true,
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
          role: request.module
            ? {
                module: request.module,
              }
            : undefined,
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
