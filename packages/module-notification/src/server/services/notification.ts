import { BaseService } from '@roxavn/core/server';
import { Notification, UserNotification } from '../entities';

export class CreateNotificationService extends BaseService {
  async handle(request: {
    resource: string;
    resourceId: string;
    action: string;
    module: string;
    metadata?: any;
    userIds: string[];
  }) {
    const result = await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(Notification)
      .values({
        module: request.module,
        action: request.action,
        metadata: request.metadata,
        resource: request.resource,
        resourceId: request.resourceId,
      })
      .orUpdate(['metadata'], ['resource', 'resourceId', 'action', 'module'])
      .execute();

    await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(UserNotification)
      .values(
        request.userIds.map((userId) => ({
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
