import {
  Api,
  ExactProps,
  ForbiddenException,
  IsArray,
  IsOptional,
  Collection,
  UnauthorizedException,
  Min,
} from '@roxavn/core/share';
import { Type } from 'class-transformer';

import { RoleResponse } from '../interfaces';
import { baseModule } from '../module';

class GetUserRolesRequest extends ExactProps<GetUserRolesRequest> {
  @Min(1)
  @Type(() => Number)
  public readonly userId: number;

  @IsArray()
  @IsOptional()
  public readonly scopes?: string[];

  @IsOptional()
  public readonly scopeId?: string;
}

type GetUserRolesResponse = Collection<RoleResponse>;

export const getUserRolesApi: Api<
  GetUserRolesRequest,
  GetUserRolesResponse,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/user-roles',
  validator: GetUserRolesRequest,
});
