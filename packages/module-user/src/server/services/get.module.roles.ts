import { ILike, In } from 'typeorm';
import { getModuleRolesApi } from '../../base';
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
          id: request.ids && In(request.ids),
          resource: request.resource && ILike(`%${request.resource}%`),
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
