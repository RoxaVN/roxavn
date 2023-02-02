import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/share';
import { In } from 'typeorm';

import { getUserRolesApi } from '../../share';
import { UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getUserRolesApi)
export class GetUserRolesApiService extends ApiService<typeof getUserRolesApi> {
  async handle(request: InferApiRequest<typeof getUserRolesApi>) {
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
        ownerId: request.id,
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
