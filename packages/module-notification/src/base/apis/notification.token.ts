import {
  ApiSource,
  ExactProps,
  IsOptional,
  MinLength,
  TransformArray,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';

const notificationTokenSource = new ApiSource<{
  id: string;
  token: string;
  provider: string;
  providerId: string;
  tags?: string[];
}>([scopes.NotificationToken], baseModule);

class UpdateNotificationTokenRequest extends ExactProps<UpdateNotificationTokenRequest> {
  @MinLength(1)
  public readonly token!: string;

  @MinLength(1)
  public readonly provider!: string;

  @MinLength(1)
  public readonly providerId!: string;

  @MinLength(1, { each: true })
  @TransformArray()
  @IsOptional()
  public readonly tags?: string[];
}

export const notificationTokenApi = {
  create: notificationTokenSource.create({
    validator: UpdateNotificationTokenRequest,
    permission: permissions.CreateNotificationToken,
  }),
};
