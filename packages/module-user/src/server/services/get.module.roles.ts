import { QueryUtils } from '@roxavn/core/server';
import { scopeManager } from '@roxavn/core/share';
import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';
import { And, In } from 'typeorm';

import { getModuleRolesApi } from '../../share';
import { Role } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getModuleRolesApi)
export class GetModuleRolesApiService extends AuthApiService<
  typeof getModuleRolesApi
> {
  async handle(request: InferAuthApiRequest<typeof getModuleRolesApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const moduleScopes = scopeManager
      .getScopes()
      .filter((s) => !s.hasId)
      .map((s) => s.type);
    const query = QueryUtils.filter(request);
    if (query.scope) {
      query.scope = And(query.scope, In(moduleScopes));
    } else {
      query.scope = In(moduleScopes);
    }

    const [roles, totalItems] = await this.dbSession
      .getRepository(Role)
      .findAndCount({
        where: query,
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
