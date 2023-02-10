import { getStatsModuleRoleApi } from '../../base';
import { UserRole } from '../entities';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { serverModule } from '../module';

@serverModule.useApi(getStatsModuleRoleApi)
export class GetStatsModuleRoleApiService extends AuthApiService<
  typeof getStatsModuleRoleApi
> {
  async handle(request: InferAuthApiRequest<typeof getStatsModuleRoleApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const totalItems = parseInt(
      (
        await this.dbSession
          .createQueryBuilder(UserRole, 'userRole')
          .select('COUNT(DISTINCT("ownerId"))', 'count')
          .where('userRole.resourceId = :resourceId', { resourceId: '' })
          .getRawOne()
      ).count
    );

    const users: any = await this.dbSession
      .createQueryBuilder(UserRole, 'userRole')
      .select('userRole.ownerId', 'ownerId')
      .addSelect('COUNT(userRole.ownerId)', 'rolesCount')
      .where('userRole.resourceId = :resourceId', { resourceId: '' })
      .groupBy('userRole.ownerId')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getRawMany();

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}
