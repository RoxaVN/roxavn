import {
  ApiSource,
  BadRequestException,
  ExactProps,
  MinLength,
} from '@roxavn/core/base';
import { scopes, permissions } from '@roxavn/module-user/base';

import { baseModule } from '../module.js';

const identitySource = new ApiSource([scopes.Identity], baseModule);

class VeritySignatureRequest extends ExactProps<VeritySignatureRequest> {
  @MinLength(1)
  public readonly web3AuthId: string;

  @MinLength(1)
  public readonly signature: string;
}

class CreateIdentityRequest extends ExactProps<CreateIdentityRequest> {
  @MinLength(1)
  public readonly web3AuthId: string;

  @MinLength(1)
  public readonly signature: string;
}

export const identityApi = {
  create: identitySource.create({
    validator: CreateIdentityRequest,
    permission: permissions.CreateIdentity,
  }),
  verifySignature: identitySource.custom<
    VeritySignatureRequest,
    {
      id: string;
      userId: string;
      accessToken: string;
    },
    BadRequestException
  >({
    method: 'POST',
    path: identitySource.apiPath() + '/verifySignature',
    validator: VeritySignatureRequest,
  }),
};
