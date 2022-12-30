import { ApiService } from '@roxavn/core/server';
import {
  BadRequestException,
  InferApiRequest,
  UnauthorizedException,
} from '@roxavn/core/share';

import { LoginApi, LogoutApi, ResetPasswordApi } from '../../share';
import { Env } from '../config';
import { PasswordIdentity, UserAccessToken } from '../entities';
import { serverModule } from '../module';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { tokenService } from './token';

@serverModule.useApi(LoginApi)
export class LoginApiService extends ApiService<typeof LoginApi> {
  async handle(request: InferApiRequest<typeof LoginApi>) {
    const identity = await this.dataSource
      .getRepository(PasswordIdentity)
      .findOne({
        select: ['id', 'ownerId', 'password'],
        where: { owner: { username: request.username } },
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

@serverModule.useApi(LogoutApi)
export class LogoutApiService extends AuthApiService<typeof LogoutApi> {
  async handle(request: InferAuthApiRequest<typeof LogoutApi>) {
    await this.dataSource
      .getRepository(UserAccessToken)
      .delete({ id: request.accessToken.id });
    return {};
  }
}

@serverModule.useApi(ResetPasswordApi)
export class ResetPasswordService extends AuthApiService<
  typeof ResetPasswordApi
> {
  async handle(request: InferAuthApiRequest<typeof ResetPasswordApi>) {
    const identity = await this.dataSource
      .getRepository(PasswordIdentity)
      .findOne({
        select: ['id', 'metadata'],
        where: { owner: { username: request.username } },
      });

    if (!identity) {
      throw new BadRequestException();
    }

    const hash = identity.metadata?.token?.hash;
    const expiredAt = identity.metadata?.token?.expiredAt;

    const now = new Date();
    const isValid =
      expiredAt > now &&
      hash &&
      (await tokenService.hasher.verify(request.token, hash));

    if (!isValid) {
      throw new BadRequestException();
    }

    const passwordHash = await tokenService.hasher.hash(request.password);

    identity.password = passwordHash;
    identity.metadata = null;
    this.dataSource.getRepository(PasswordIdentity).save(identity);

    return {};
  }
}
