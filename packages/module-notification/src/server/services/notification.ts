import { BaseService } from '@roxavn/core/server';
import { Notification, UserNotification } from '../entities/index.js';

export class CreateNotificationService extends BaseService {
  async handle({
    resource,
    resourceId,
    action,
    actorId,
    module,
    metadata,
    userIds,
  }: {
    resource: string;
    resourceId: string;
    action: string;
    actorId?: string;
    module: string;
    metadata?: any;
    userIds: string[];
  }) {
    if (
      userIds.length < 1 ||
      (userIds.length === 1 && userIds[0] === actorId)
    ) {
      // not create notice for actor
      return {};
    }

    const result = await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(Notification)
      .values({
        module: module,
        action: action,
        metadata: metadata,
        resource: resource,
        resourceId: resourceId,
        actorId: actorId,
      })
      .orUpdate(
        ['metadata', 'actorId'],
        ['resource', 'resourceId', 'action', 'module']
      )
      .execute();

    await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(UserNotification)
      .values(
        userIds
          .filter((item) => item !== actorId)
          .map((userId) => ({
            notificationId: result.generatedMaps[0] as any,
            userId: userId,
            readDate: undefined,
          }))
      )
      .orUpdate(['readDate'], ['notificationId', 'userId'])
      .execute();

    return {};
  }
}
