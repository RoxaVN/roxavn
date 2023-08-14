import {
  ApiSource,
  BadRequestException,
  ExactProps,
  MinLength,
  TokenAuthData,
} from '@roxavn/core/base';
import { scopes } from '@roxavn/module-user/base';

import { baseModule } from '../module.js';

const identitySource = new ApiSource([scopes.Identity], baseModule);

class VerityTokenRequest extends ExactProps<VerityTokenRequest> {
  @MinLength(1)
  public readonly token!: string;

  @MinLength(1)
  public readonly projectId!: string;
}

export const identityApi = {
  authAndRegister: identitySource.custom<
    VerityTokenRequest,
    TokenAuthData,
    BadRequestException
  >({
    method: 'POST',
    path: identitySource.apiPath() + '/authAndRegister',
    validator: VerityTokenRequest,
  }),
};
