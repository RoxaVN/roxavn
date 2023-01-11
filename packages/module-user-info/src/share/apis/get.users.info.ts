import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  Min,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/share';
import { Type } from 'class-transformer';

import { UserInfoResponse } from '../interfaces';
import { baseModule } from '../module';
import { Permissions } from '../roles';

class GetUsersInfoRequest extends ExactProps<GetUsersInfoRequest> {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetUsersInfoResponse = PaginatedCollection<UserInfoResponse>;

export const getUsersInfoApi: Api<
  GetUsersInfoRequest,
  GetUsersInfoResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/users-info',
  validator: GetUsersInfoRequest,
  permission: Permissions.ReadUsersInfo,
});
