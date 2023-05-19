import {
  InferApiRequest,
  NotFoundException,
  AlreadyExistsException,
} from '@roxavn/core/base';
import { And, ILike, In, LessThan, MoreThan } from 'typeorm';

import { userApi } from '../../base/index.js';
import { User } from '../entities/index.js';
import { serverModule } from '../module.js';
import { ApiService } from '@roxavn/core/server';

@serverModule.useApi(userApi.getOne)
export class GetMyUserApiService extends ApiService {
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
export class GetUsersApiService extends ApiService {
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
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(userApi.search)
export class SearchUsersApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userApi.search>) {
    const users = await this.dbSession.getRepository(User).find({
      select: ['id', 'username'],
      where: {
        id: request.ids && In(request.ids),
        username: request.usernameText && ILike(`${request.usernameText}%`),
      },
      take: request.ids ? request.ids.length : 10,
    });
    return {
      items: users,
    };
  }
}

@serverModule.useApi(userApi.create)
export class CreateUserApiService extends ApiService {
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
