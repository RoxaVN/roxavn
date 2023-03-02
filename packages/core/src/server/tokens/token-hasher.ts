import bcrypt from 'bcryptjs';

interface TokenHasherOptions {
  /**
   * A number of salt rounds used by Bcrypt.
   */
  saltRounds?: number;
}

export class TokenHasher {
  private readonly options: Required<TokenHasherOptions>;

  /**
   * Creates a token hasher to hash and verify string tokens.
   *
   * Default salt rounds is 10.
   *
   * @param options An option.
   */
  constructor(options: TokenHasherOptions = {}) {
    this.options = Object.assign(
      {
        saltRounds: 10,
      },
      options
    );
  }

  /**
   * Hashes a token.
   *
   * @param token A token to be hashed.
   */
  public async hash(token: string): Promise<string> {
    return bcrypt.hash(token, this.options.saltRounds);
  }

  /**
   * Verifies a token and a hash are matched or not.
   *
   * @param token A token to be verified.
   * @param hash A hash of a token.
   */
  public async verify(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }
}
