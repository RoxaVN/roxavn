import {
  Api,
  ArrayMaxSize,
  ArrayMinSize,
  ExactProps,
  ForbiddenException,
  IsArray,
  IsDateString,
  IsOptional,
  Min,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/share';

import { Type } from 'class-transformer';
import { UserResponse } from '../interfaces';
import { baseModule } from '../module';
import { Permissions } from '../permissions';

class GetUsersRequest extends ExactProps<GetUsersRequest> {
  @IsOptional()
  public readonly username?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDateString({}, { each: true })
  @IsOptional()
  public readonly createdDate?: Date[];

  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetUsersResponse = PaginatedCollection<UserResponse>;

export const getUsersApi: Api<
  GetUsersRequest,
  GetUsersResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/users',
  validator: GetUsersRequest,
  permission: Permissions.ReadUser,
});
