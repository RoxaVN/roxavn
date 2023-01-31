import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { getMyUserInfoApi } from '../../share';
import { UserInfo } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getMyUserInfoApi)
export class GetMyUserInfoApiService extends AuthApiService<
  typeof getMyUserInfoApi
> {
  async handle(request: InferAuthApiRequest<typeof getMyUserInfoApi>) {
    const user = await this.dbSession.getRepository(UserInfo).findOne({
      where: { id: request.user.id },
    });
    return user || {};
  }
}