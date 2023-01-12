import {
  Api,
  ExactProps,
  IsOptional,
  Collection,
  UnauthorizedException,
} from '@roxavn/core/share';

import { ModuleResponse } from '../interfaces';
import { baseModule } from '../module';

class GetMyAdminModulesRequest extends ExactProps<GetMyAdminModulesRequest> {
  @IsOptional()
  public readonly username?: string;
}

type GetMyAdminModulesResponse = Collection<ModuleResponse>;

export const getMyAdminModulesApi: Api<
  GetMyAdminModulesRequest,
  GetMyAdminModulesResponse,
  UnauthorizedException
> = baseModule.api({
  method: 'GET',
  path: '/admin-modules/me',
  validator: GetMyAdminModulesRequest,
});
