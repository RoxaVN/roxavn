import { ApiService, InferAuthApiRequest } from '@roxavn/core/server';

import { notificationTokenApi } from '../../base';
import { NotificationToken } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(notificationTokenApi.create)
export class CreateNotificationTokenApiService extends ApiService {
  async handle(
    request: InferAuthApiRequest<typeof notificationTokenApi.create>
  ) {
    const id = request.$accessToken.id;
    await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(NotificationToken)
      .values({
        id: id,
        failCount: 0,
        token: request.token,
        provider: request.provider,
        providerId: request.providerId,
        userId: request.$user.id,
        tags: request.tags,
      })
      .orUpdate(
        ['token', 'provider', 'providerId', 'failCount', 'tags'],
        ['id']
      )
      .execute();

    return { id };
  }
}
