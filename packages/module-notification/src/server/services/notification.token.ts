import { type InferApiRequest } from '@roxavn/core';
import {
  AuthUser,
  type InferContext,
  InjectDatabaseService,
  AuthAcesstoken,
} from '@roxavn/core/server';

import { notificationTokenApi } from '../../base/index.js';
import { NotificationToken } from '../entities/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(notificationTokenApi.create)
export class CreateNotificationTokenApiService extends InjectDatabaseService {
  async handle(
    request: InferApiRequest<typeof notificationTokenApi.create>,
    @AuthUser authUser: InferContext<typeof AuthUser>,
    @AuthAcesstoken authToken: InferContext<typeof AuthAcesstoken>
  ) {
    const id = authToken.id;
    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(NotificationToken)
      .values({
        id: id,
        failCount: 0,
        token: request.token,
        provider: request.provider,
        providerId: request.providerId,
        userId: authUser.id,
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
