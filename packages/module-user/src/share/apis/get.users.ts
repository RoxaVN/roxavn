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
import { User } from '../interfaces';
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

type GetUsersResponse = PaginatedCollection<User>;

export const GetUsersApi: Api<
  GetUsersRequest,
  GetUsersResponse,
  UnauthorizedException | ForbiddenException
> = {
  method: 'GET',
  path: '/users',
  validator: GetUsersRequest,
  permission: Permissions.ReadUser,
};
