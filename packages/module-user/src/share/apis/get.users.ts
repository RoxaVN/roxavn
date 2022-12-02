import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  Min,
  MinLength,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/share';

import { Type } from 'class-transformer';
import { User } from '../interfaces/user.interfaces';
import { Permissions } from '../permissions';

class GetUsersRequest extends ExactProps<GetUsersRequest> {
  @MinLength(1)
  @IsOptional()
  public readonly name?: string;

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
