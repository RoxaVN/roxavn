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
import { UserFile } from '../interfaces';
import { Permissions } from '../permissions';

class GetUserFilesRequest extends ExactProps<GetUserFilesRequest> {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetUserFilesResponse = PaginatedCollection<UserFile>;

export const GetUserFilesApi: Api<
  GetUserFilesRequest,
  GetUserFilesResponse,
  UnauthorizedException | ForbiddenException
> = {
  method: 'GET',
  path: '/user_files',
  validator: GetUserFilesRequest,
  permission: Permissions.ReadUserFIles,
};
