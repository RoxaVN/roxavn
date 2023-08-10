import { type ServiceFactory } from '@roxavn/core/server';

import { serverModule } from '../../module.js';
import { TokenHasher } from './token-hasher.js';
import { TokenSigner } from './token-signer.js';
import { Token } from './token.js';
import { GetSettingService } from '../setting.js';
import { constants } from '../../../base/index.js';

export class TokenService {
  public readonly creator = Token;

  public readonly signer: TokenSigner;
  public readonly hasher: TokenHasher;

  constructor(tokenSigner: TokenSigner, tokenHasher: TokenHasher) {
    this.signer = tokenSigner;
    this.hasher = tokenHasher;
  }

  @serverModule.bindFactory()
  static create: ServiceFactory = async (context) => {
    const service = await context.container.getAsync(GetSettingService);
    const config = await service.handle({
      module: serverModule.name,
      name: constants.TOKEN_SETTING,
    });

    const tokenSigner = new TokenSigner({
      secret: config.signSecret,
      algorithm: config.signAlgorithm,
    });
    const tokenHasher = new TokenHasher({
      saltRounds: config.saltRounds,
    });

    return new TokenService(tokenSigner, tokenHasher);
  };
}
