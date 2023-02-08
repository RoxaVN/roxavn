import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  Min,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/base';

import { Type } from 'class-transformer';
import { UserFile } from '../interfaces';
import { baseModule } from '../module';
import { Permissions } from '../permissions';

class GetUserFilesRequest extends ExactProps<GetUserFilesRequest> {
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type GetUserFilesResponse = PaginatedCollection<UserFile>;

export const getUserFilesApi: Api<
  GetUserFilesRequest,
  GetUserFilesResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/user_files',
  validator: GetUserFilesRequest,
  permission: Permissions.ReadUserFIles,
});
