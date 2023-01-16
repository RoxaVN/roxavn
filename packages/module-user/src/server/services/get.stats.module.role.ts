import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { getStatsModuleRoleApi } from '../../share';
import { UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getStatsModuleRoleApi)
export class GetStatsModuleRoleApiService extends AuthApiService<
  typeof getStatsModuleRoleApi
> {
  async handle(request: InferAuthApiRequest<typeof getStatsModuleRoleApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const query = this.dbSession
      .createQueryBuilder(UserRole, 'userRole')
      .leftJoinAndSelect('userRole.owner', 'owner')
      .select('userRole.ownerId')
      .addSelect('COUNT(userRole.ownerId)', 'rolesCount')
      .where('userRole.scopeId = :scopeId', { scopeId: '' })
      .groupBy('userRole.ownerId');

    const totalItems = await query.getCount();
    const users: any = await query
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getMany();

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}
