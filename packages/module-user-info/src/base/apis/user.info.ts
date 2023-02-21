import { ApiSource, ExactProps, IsOptional, Min } from '@roxavn/core/base';
import { Type } from 'class-transformer';

import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

const userInfoSource = new ApiSource<{
  id: number;
  birthday?: Date;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  avatar?: string;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
}>([Resources.UserInfo], baseModule);

class GetUsersInfoRequest extends ExactProps<GetUsersInfoRequest> {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

class GetUserInfoRequest extends ExactProps<GetUserInfoRequest> {
  @Min(1)
  @Type(() => Number)
  public readonly userInfoId: number;
}

export const userInfoApi = {
  getMany: userInfoSource.getMany({
    validator: GetUsersInfoRequest,
    permission: Permissions.ReadUsersInfo,
  }),
  getOne: userInfoSource.getOne({
    validator: GetUserInfoRequest,
    permission: Permissions.ReadUserInfo,
  }),
};
