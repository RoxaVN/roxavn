import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import {
  BaseService,
  DatabaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';
import { GetFileApiService } from '@roxavn/module-upload/server';
import { In } from 'typeorm';

import { userInfoApi } from '../../base/index.js';
import { UserInfo } from '../entities/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(userInfoApi.getMany)
export class GetUsersInfoApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof userInfoApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.entityManager
      .getRepository(UserInfo)
      .findAndCount({
        where: {
          id: request.ids && In(request.ids),
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

@serverModule.useApi(userInfoApi.getOne)
export class GetUserInfoApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof userInfoApi.getOne>) {
    const user = await this.entityManager.getRepository(UserInfo).findOne({
      where: { id: request.userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}

@serverModule.useApi(userInfoApi.update)
export class UpdateUserInfoApiService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(GetFileApiService) private getFileApiService: GetFileApiService
  ) {
    super();
  }

  async handle(request: InferApiRequest<typeof userInfoApi.update>) {
    const avatar =
      request.avatar &&
      (await this.getFileApiService.handle({
        fileId: request.avatar.id,
      }));
    await this.databaseService.manager
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
