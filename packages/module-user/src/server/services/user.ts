import { NotFoundException } from '@roxavn/core/share';

import {
  GetMyUserApi,
  GetUsersApi,
  CreateUserApi,
  UserExistsException,
} from '../../share';
import { PasswordIdentity, User } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { tokenService } from './token';
import { Env } from '../config';

@serverModule.useApi(GetMyUserApi)
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

@serverModule.useApi(GetUsersApi)
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

@serverModule.useApi(CreateUserApi)
export class CreateUserApiService extends AuthApiService<typeof CreateUserApi> {
  async handle(request: InferAuthApiRequest<typeof CreateUserApi>) {
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
