import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';
import { In } from 'typeorm';

import { getUserRolesApi } from '../../share';
import { UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getUserRolesApi)
export class GetUserRolesApiService extends AuthApiService<
  typeof getUserRolesApi
> {
  async handle(request: InferAuthApiRequest<typeof getUserRolesApi>) {
    const items = await this.dataSource.getRepository(UserRole).find({
      relations: { role: true },
      select: { role: {} },
      where: {
        ownerId: request.user.id,
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
