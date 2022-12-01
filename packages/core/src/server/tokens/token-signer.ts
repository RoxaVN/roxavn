import crypto from 'crypto';

interface TokenSignerOptions {
  /**
   * A secret key.
   */
  secret: string;

  /**
   * A hashing algorithm.
   */
  algorithm?: string;

  /**
   * An encoding digest.
   */
  encoding?: 'base64' | 'hex';
}

export class TokenSigner {
  private readonly options: Required<TokenSignerOptions>;

  /**
   * Creates a token signer to sign and verify string tokens.
   *
   * Default algorithm is 'sha256' and encoding is 'base64'.
   *
   * @param options An option.
   */
  constructor(options: TokenSignerOptions) {
    this.options = Object.assign(
      {
        algorithm: 'sha256',
        encoding: 'base64',
      },
      options
    );
  }

  /**
   * Signs a token and returns its signature.
   *
   * @param token A token to be signed.
   */
  public sign(token: string): string {
    return crypto
      .createHmac(this.options.algorithm, this.options.secret)
      .update(token)
      .digest(this.options.encoding)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * Verifies a token and its signature are matched or not.
   *
   * @param token A signed token.
   * @param signature A signature.
   */
  public verify(token: string, signature: string): boolean {
    return this.sign(token) === signature;
  }
}
