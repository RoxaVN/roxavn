import { QueryUtils } from '@roxavn/core/server';
import { NotFoundException } from '@roxavn/core/share';

import {
  getMyUserApi,
  getUsersApi,
  createUserApi,
  UserExistsException,
} from '../../share';
import { PasswordIdentity, User } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { tokenService } from './token';
import { Env } from '../config';

@serverModule.useApi(getMyUserApi)
export class GetMyUserService extends AuthApiService<typeof getMyUserApi> {
  async handle(request: InferAuthApiRequest<typeof getMyUserApi>) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: request.user.id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}

@serverModule.useApi(getUsersApi)
export class GetUsersService extends AuthApiService<typeof getUsersApi> {
  async handle(request: InferAuthApiRequest<typeof getUsersApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dataSource
      .getRepository(User)
      .findAndCount({
        where: QueryUtils.filter(request),
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

@serverModule.useApi(createUserApi)
export class CreateUserService extends AuthApiService<typeof createUserApi> {
  async handle(request: InferAuthApiRequest<typeof createUserApi>) {
    try {
      const token = await tokenService.creator.create({
        alphabetType: 'LOWERCASE_ALPHA_NUM',
        size: 21,
      });
      const hash = await tokenService.hasher.hash(token);
      const expiredAt = Date.now() + Env.SHORT_TIME_TO_LIVE;

      return await this.dataSource.transaction(async (manager) => {
        const identity = new PasswordIdentity();
        identity.metadata = { token: { hash, expiredAt } };
        const user = new User();
        user.username = request.username;
        await manager.save(user);
        identity.owner = user;
        await manager.save(identity);

        return {
          id: user.id,
          resetPasswordToken: token,
        };
      });
    } catch (error) {
      throw new UserExistsException();
    }
  }
}
