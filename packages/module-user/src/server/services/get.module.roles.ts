import { QueryUtils } from '@roxavn/core/server';

import { getModuleRolesApi } from '../../share';
import { Role } from '../entities';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { serverModule } from '../module';

@serverModule.useApi(getModuleRolesApi)
export class GetModuleRolesApiService extends AuthApiService<
  typeof getModuleRolesApi
> {
  async handle(request: InferAuthApiRequest<typeof getModuleRolesApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [roles, totalItems] = await this.dbSession
      .getRepository(Role)
      .findAndCount({
        where: {
          ...QueryUtils.filter(request),
          hasId: false,
        },
        order: { id: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: roles,
      pagination: { page, pageSize, totalItems },
    };
  }
}
