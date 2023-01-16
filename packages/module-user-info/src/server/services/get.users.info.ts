import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { getUsersInfoApi } from '../../share';
import { UserInfo } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getUsersInfoApi)
export class GetUsersInfoApiService extends AuthApiService<
  typeof getUsersInfoApi
> {
  async handle(request: InferAuthApiRequest<typeof getUsersInfoApi>) {
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
