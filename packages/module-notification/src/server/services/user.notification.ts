import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { userNotificationApi } from '../../base';
import { UserNotification } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(userNotificationApi.getMany)
export class GetUserNotificationsApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userNotificationApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.dbSession
      .getRepository(UserNotification)
      .findAndCount({
        relations: ['notification'],
        where: {
          userId: request.userId,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items.map((item) => ({
        readDate: item.readDate,
        ...item.notification,
      })),
      pagination: { page, pageSize, totalItems },
    };
  }
}
