import {
  InferApiRequest,
  NotFoundException,
  AlreadyExistsException,
} from '@roxavn/core/base';
import { And, ILike, LessThan, MoreThan } from 'typeorm';

import { userApi } from '../../base';
import { User } from '../entities';
import { serverModule } from '../module';
import { ApiService } from '@roxavn/core/server';

@serverModule.useApi(userApi.getOne)
export class GetMyUserApiService extends ApiService<typeof userApi.getOne> {
  async handle(request: InferApiRequest<typeof userApi.getOne>) {
    const user = await this.dbSession.getRepository(User).findOne({
      where: { id: request.userId },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}

@serverModule.useApi(userApi.getMany)
export class GetUsersApiService extends ApiService<typeof userApi.getMany> {
  async handle(request: InferApiRequest<typeof userApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dbSession
      .getRepository(User)
      .findAndCount({
        where: {
          username: request.username && ILike(request.username + '%'),
          createdDate:
            request.createdDate &&
            And(
              MoreThan(request.createdDate[0]),
              LessThan(request.createdDate[1])
            ),
        },
        order: { id: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(userApi.create)
export class CreateUserApiService extends ApiService<typeof userApi.create> {
  async handle(request: InferApiRequest<typeof userApi.create>) {
    const user = new User();
    user.username = request.username;
    try {
      await this.dbSession.save(user);
    } catch (e) {
      throw new AlreadyExistsException();
    }

    return {
      id: user.id,
    };
  }
}
