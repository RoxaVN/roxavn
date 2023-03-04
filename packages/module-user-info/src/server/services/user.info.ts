import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { GetFileApiService } from '@roxavn/module-upload/server';

import { userInfoApi } from '../../base';
import { UserInfo } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(userInfoApi.getMany)
export class GetUsersInfoApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userInfoApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dbSession
      .getRepository(UserInfo)
      .findAndCount({
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

@serverModule.useApi(userInfoApi.getOne)
export class GetUserInfoApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userInfoApi.getOne>) {
    const user = await this.dbSession.getRepository(UserInfo).findOne({
      where: { id: request.userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}

@serverModule.useApi(userInfoApi.update)
export class UpdateUserInfoApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userInfoApi.update>) {
    const avatar =
      request.avatar &&
      (await this.create(GetFileApiService).handle({
        fileId: request.avatar.id,
      }));
    await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(UserInfo)
      .values({
        id: request.userId,
        firstName: request.firstName,
        middleName: request.middleName,
        lastName: request.lastName,
        gender: request.gender,
        birthday: request.birthday,
        avatar: avatar,
      })
      .orUpdate(
        ['firstName', 'lastName', 'middleName', 'gender', 'birthday', 'avatar'],
        ['id']
      )
      .execute();
    return {};
  }
}
