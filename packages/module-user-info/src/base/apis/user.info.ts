import {
  ApiSource,
  ExactProps,
  IsIn,
  IsNotEmptyObject,
  IsOptional,
  Min,
  MinLength,
  TransformArray,
  TransformDate,
} from '@roxavn/core/base';
import { FileInfo } from '@roxavn/module-upload/base';
import { Type } from 'class-transformer';

import { permissions, scopes } from '../access';
import { constants } from '../constants';
import { baseModule } from '../module';

const userInfoSource = new ApiSource<{
  id: string;
  birthday?: Date;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  avatar?: FileInfo;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.UserInfo], baseModule);

class GetUsersInfoRequest extends ExactProps<GetUsersInfoRequest> {
  @MinLength(1, { each: true })
  @IsOptional()
  @TransformArray()
  public readonly ids?: string[];

  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

class GetUserInfoRequest extends ExactProps<GetUserInfoRequest> {
  @MinLength(1)
  public readonly userId: string;
}

class UpdateUserInfoRequest extends ExactProps<UpdateUserInfoRequest> {
  @MinLength(1)
  public readonly userId: string;

  @MinLength(1)
  public readonly firstName: string;

  @MinLength(1)
  @IsOptional()
  public readonly middleName?: string;

  @MinLength(1)
  @IsOptional()
  public readonly lastName?: string;

  @IsNotEmptyObject()
  @IsOptional()
  public readonly avatar?: FileInfo;

  @IsOptional()
  @TransformDate()
  public readonly birthday?: Date;

  @IsIn(Object.values(constants.Genders))
  @IsOptional()
  public readonly gender?: string;
}

export const userInfoApi = {
  getMany: userInfoSource.getMany({
    validator: GetUsersInfoRequest,
    permission: permissions.ReadUsersInfo,
  }),
  getOne: userInfoSource.getOne({
    validator: GetUserInfoRequest,
    permission: permissions.ReadUserInfo,
  }),
  update: userInfoSource.update({
    validator: UpdateUserInfoRequest,
    permission: permissions.UpdateUserInfo,
  }),
};
