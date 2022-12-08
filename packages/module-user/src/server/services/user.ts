import { useApi } from '@roxavn/core/server';
import { NotFoundException } from '@roxavn/core/share';

import { GetMyUserApi, GetUsersApi } from '../../share';
import { User } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';

@useApi(serverModule, GetMyUserApi)
export class GetMyUserApiService extends AuthApiService<typeof GetMyUserApi> {
  async handle(request: InferAuthApiRequest<typeof GetMyUserApi>) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: request.user.id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}

@useApi(serverModule, GetUsersApi)
export class GetUsersApiService extends AuthApiService<typeof GetUsersApi> {
  async handle(request: InferAuthApiRequest<typeof GetUsersApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dataSource
      .getRepository(User)
      .findAndCount({
        order: { createdDate: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}
