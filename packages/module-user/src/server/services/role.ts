import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { ILike, In } from 'typeorm';

import { roleApi } from '../../base';
import { Role, UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(roleApi.getMany)
export class GetRolesApiService extends ApiService {
  async handle(request: InferApiRequest<typeof roleApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [roles, totalItems] = await this.dbSession
      .getRepository(Role)
      .findAndCount({
        where: {
          id: request.ids && In(request.ids),
          module: request.module,
          scope: request.scope
            ? request.scope
            : request.scopeText
            ? ILike(`%${request.scopeText}%`)
            : undefined,
          hasId: !!request.scopeId,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: roles,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(roleApi.moduleStats)
export class GetModuleRoleStatsApiService extends ApiService {
  async handle(request: InferApiRequest<typeof roleApi.moduleStats>) {
    const page = request.page || 1;
    const pageSize = 10;

    const totalItems = parseInt(
      (
        await this.dbSession
          .createQueryBuilder(UserRole, 'userRole')
          .select('COUNT(DISTINCT("userId"))', 'count')
          .where('userRole.scopeId = :scopeId', { scopeId: '' })
          .getRawOne()
      ).count
    );

    const users: any = await this.dbSession
      .createQueryBuilder(UserRole, 'userRole')
      .select('userRole.userId', 'userId')
      .addSelect('COUNT(userRole.userId)', 'rolesCount')
      .where('userRole.scopeId = :scopeId', { scopeId: '' })
      .groupBy('userRole.userId')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getRawMany();

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}
