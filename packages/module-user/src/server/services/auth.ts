import { ApiService, useApi } from '@roxavn/core/server';
import { InferApiRequest, UnauthorizedException } from '@roxavn/core/share';

import { LoginApi, LogoutApi } from '../../share';
import { Env } from '../config';
import { PasswordIdentity, UserAccessToken } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { tokenService } from './token';

@useApi(serverModule, LoginApi)
export class LoginApiService extends ApiService<typeof LoginApi> {
  async handle(request: InferApiRequest<typeof LoginApi>) {
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

@useApi(serverModule, LogoutApi)
export class LogoutApiService extends AuthApiService<typeof LogoutApi> {
  async handle(request: InferAuthApiRequest<typeof LogoutApi>) {
    await this.dataSource
      .getRepository(UserAccessToken)
      .delete({ id: request.accessToken.id });
    return {};
  }
}
