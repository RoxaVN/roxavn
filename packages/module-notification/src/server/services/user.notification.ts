import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { IsNull } from 'typeorm';

import { userNotificationApi } from '../../base/index.js';
import { UserNotification } from '../entities/index.js';
import { serverModule } from '../module.js';

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

@serverModule.useApi(userNotificationApi.update)
export class UpdateUserNotificationApiService extends ApiService {
  async handle(request: InferApiRequest<typeof userNotificationApi.update>) {
    await this.dbSession.update(
      UserNotification,
      {
        userId: request.userId,
        notificationId: request.notificationId,
      },
      { readDate: request.isRead ? new Date() : undefined }
    );
    return {};
  }
}

@serverModule.useApi(userNotificationApi.countUnread)
export class CountUnreadUserNotificationApiService extends ApiService {
  async handle(
    request: InferApiRequest<typeof userNotificationApi.countUnread>
  ) {
    const count = await this.dbSession.getRepository(UserNotification).count({
      where: {
        userId: request.userId,
        readDate: IsNull(),
      },
      take: 100, // get max 100 first
    });
    return { count };
  }
}
