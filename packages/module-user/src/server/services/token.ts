import { Token, TokenHasher, TokenSigner } from '@roxavn/core/server';
import { Env } from '../config';

export class TokenService {
  private readonly tokenCreator = Token;
  private readonly tokenSigner: TokenSigner;
  private readonly tokenHasher: TokenHasher;

  constructor() {
    this.tokenSigner = new TokenSigner({
      secret: Env.TOKEN_SIGN_SECRET,
      algorithm: Env.TOKEN_SIGN_ALGORITHM,
    });

    this.tokenHasher = new TokenHasher({
      saltRounds: Env.TOKEN_SALT_ROUNDS,
    });
  }

  public get creator(): typeof Token {
    return this.tokenCreator;
  }

  public get signer(): TokenSigner {
    return this.tokenSigner;
  }

  public get hasher(): TokenHasher {
    return this.tokenHasher;
  }
}
