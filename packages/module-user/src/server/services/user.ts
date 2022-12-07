import { useApi } from '@roxavn/core/server';
import { NotFoundException } from '@roxavn/core/share';

import { GetMyUserApi } from '../../share';
import { User } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from './middlerware';

@useApi(serverModule, GetMyUserApi)
class GetMyUserApiService extends AuthApiService<typeof GetMyUserApi> {
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

export { GetMyUserApiService };
