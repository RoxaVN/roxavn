import { type InferApiRequest } from '@roxavn/core/base';
import {
  BaseService,
  type InferContext,
  Ip,
  inject,
  UserAgent,
} from '@roxavn/core/server';
import { IdentityService } from '@roxavn/module-user/server';

import { constants, identityApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Web3AuthService } from './web3.auth.js';

@serverModule.useApi(identityApi.verifySignature)
export class VerifySignatureService extends BaseService {
  constructor(
    @inject(IdentityService) private identityService: IdentityService,
    @inject(Web3AuthService) private web3AuthService: Web3AuthService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof identityApi.verifySignature>,
    @Ip ipAddress: InferContext<typeof Ip>,
    @UserAgent userAgent: InferContext<typeof UserAgent>
  ) {
    const { address } = await this.web3AuthService.handle(request);

    return this.identityService.handle({
      authenticator: 'web3',
      ipAddress,
      userAgent,
      subject: address,
      type: constants.identityTypes.WEB3_ADDRESS,
    });
  }
}
