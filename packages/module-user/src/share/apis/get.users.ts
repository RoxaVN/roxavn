import {
  Api,
  ApiFilter,
  ExactProps,
  ForbiddenException,
  IsOptional,
  Min,
  PaginatedCollection,
  IsQueryFilter,
  UnauthorizedException,
} from '@roxavn/core/share';

import { Type, Transform } from 'class-transformer';
import { UserResponse } from '../interfaces';
import { baseModule } from '../module';
import { Permissions } from '../permissions';

class GetUsersRequest extends ExactProps<GetUsersRequest> {
  @Transform(({ value }) => ApiFilter.parse(value))
  @IsQueryFilter([ApiFilter.CONTAINS])
  @IsOptional()
  public readonly username?: ApiFilter;

  @Transform(({ value }) => ApiFilter.parse(value))
  @IsQueryFilter([ApiFilter.GREATER_THAN, ApiFilter.LESS_THAN])
  @IsOptional()
  public readonly createdDate?: ApiFilter[];

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
