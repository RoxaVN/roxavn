import {
  accessManager,
  ApiSource,
  ExactProps,
  IsOptional,
  Min,
  MinLength,
  TransformNumber,
  UnauthorizedException,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface NotificationResponse {
  id: string;
  resource: string;
  resourceId: string;
  action: string;
  actorId?: string;
  module: string;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
  readDate?: Date;
}

const userNotificationSource = new ApiSource<NotificationResponse>(
  [accessManager.scopes.User, scopes.Notification],
  baseModule
);

class GetUserNotificationsRequest extends ExactProps<GetUserNotificationsRequest> {
  @MinLength(1)
  public readonly userId!: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page = 1;
}

class CountUnreadUserNotificationsRequest extends ExactProps<CountUnreadUserNotificationsRequest> {
  @MinLength(1)
  public readonly userId!: string;
}

class UpdateUserNotificationsRequest extends ExactProps<UpdateUserNotificationsRequest> {
  @MinLength(1)
  public readonly userId!: string;

  @MinLength(1)
  public readonly notificationId!: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly isRead?: number;
}

export const userNotificationApi = {
  countUnread: userNotificationSource.custom<
    CountUnreadUserNotificationsRequest,
    { count: number },
    UnauthorizedException
  >({
    path: userNotificationSource.apiPath() + '/unread/count',
    method: 'get',
    validator: CountUnreadUserNotificationsRequest,
    permission: permissions.ReadUserNotifications,
  }),
  getMany: userNotificationSource.getMany({
    validator: GetUserNotificationsRequest,
    permission: permissions.ReadUserNotifications,
  }),
  update: userNotificationSource.update({
    validator: UpdateUserNotificationsRequest,
    permission: permissions.UpdateUserNotification,
  }),
};
