import {
  accessManager,
  ApiSource,
  ExactProps,
  IsOptional,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';

const userNotificationSource = new ApiSource<{
  id: string;
  resource: string;
  resourceId: string;
  action: string;
  module: string;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
  readDate?: Date;
}>([accessManager.scopes.User, scopes.Notification], baseModule);

class GetUserNotificationsRequest extends ExactProps<GetUserNotificationsRequest> {
  @MinLength(1)
  public readonly userId!: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page = 1;
}

export const userNotificationApi = {
  getMany: userNotificationSource.getMany({
    validator: GetUserNotificationsRequest,
    permission: permissions.ReadUserNotifications,
  }),
};
