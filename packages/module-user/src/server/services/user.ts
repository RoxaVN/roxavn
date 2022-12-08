import { useApi } from '@roxavn/core/server';
import { NotFoundException } from '@roxavn/core/share';
import { In } from 'typeorm';

import { GetMyUserApi, GetUsersApi } from '../../share';
import { PasswordIdentity, User, UserIdentity } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';

@useApi(serverModule, GetMyUserApi)
export class GetMyUserApiService extends AuthApiService<typeof GetMyUserApi> {
  async handle(request: InferAuthApiRequest<typeof GetMyUserApi>) {
    const user = await this.dataSource.getRepository(User).findOne({
      relations: { identities: true },
      where: { id: request.user.id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      email: (user.identities?.[0] as any).email,
    };
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

    const identities = await this.dataSource.getRepository(UserIdentity).find({
      where: {
        ownerId: In(users.map((user) => user.id)),
      },
    });

    return {
      items: users.map((user) => {
        const identity = identities.find(
          (iterIdentity) => iterIdentity.ownerId === user.id
        );

        return {
          id: user.id,
          email: (identity as PasswordIdentity)?.email,
        };
      }),
      pagination: { page, pageSize, totalItems },
    };
  }
}
