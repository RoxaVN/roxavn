import { ApiService, UnauthorizedException } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/share';

import { Apis } from '../../share';
import { Env } from '../config';
import { UserAccessToken } from '../entities/user-access-token.entity';
import { PasswordIdentity } from '../entities/user-identity.entity';
import { TokenService } from './token';

export class LoginApiService extends ApiService<typeof Apis.Login> {
  async handle(request: InferApiRequest<typeof Apis.Login>) {
    const tokenService = new TokenService();

    const identity = await this.dataSource
      .getRepository(PasswordIdentity)
      .findOne({
        select: ['id', 'ownerId', 'password'],
        where: { email: request.email },
      });

    if (!identity) {
      throw new UnauthorizedException();
    }

    const isValid =
      identity.password &&
      (await tokenService.hasher.verify(request.password, identity.password));

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const token = await tokenService.creator.create({
      alphabetType: 'ALPHA_NUM',
      size: 21,
    });
    const expiredAt = new Date(Date.now() + Env.ACCESS_TOKEN_TIME_TO_LIVE);
    const tokenPart = [expiredAt.getTime(), identity.ownerId, token].join('.');
    const signature = tokenService.signer.sign(tokenPart);
    const tokenFinal = [tokenPart, signature].join('.');

    const accessToken = new UserAccessToken();
    accessToken.ownerId = identity.ownerId;
    accessToken.identityId = identity.id;
    accessToken.token = signature;
    accessToken.expiredDate = expiredAt;
    this.dataSource.getRepository(UserAccessToken).save(accessToken);

    return {
      accessToken: tokenFinal,
    };
  }
}
