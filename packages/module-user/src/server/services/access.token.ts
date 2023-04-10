import { ApiService, BaseService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/base';

import { accessTokenApi } from '../../base';
import { AccessToken } from '../entities';
import { serverModule } from '../module';
import { tokenService } from './token';
import { Env } from '../config';

@serverModule.useApi(accessTokenApi.getMany)
export class GetAccessTokensApiService extends ApiService {
  async handle(request: InferApiRequest<typeof accessTokenApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dbSession
      .getRepository(AccessToken)
      .findAndCount({
        where: {
          userId: request.userId,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(accessTokenApi.delete)
export class DeleteAccessTokenApiService extends ApiService {
  async handle(request: InferApiRequest<typeof accessTokenApi.delete>) {
    await this.dbSession
      .getRepository(AccessToken)
      .delete({ id: request.accessTokenId });
    return {};
  }
}

export class CreateAccessTokenService extends BaseService {
  async handle(request: {
    userId: string;
    identityid: string;
    authenticator: string;
    ipAddress: string;
    userAgent?: string | null;
  }) {
    const token = await tokenService.creator.create({
      alphabetType: 'ALPHA_NUM',
      size: 21,
    });
    const expiredAt = new Date(Date.now() + Env.ACCESS_TOKEN_TIME_TO_LIVE);
    const tokenPart = [expiredAt.getTime(), request.userId, token].join('.');
    const signature = tokenService.signer.sign(tokenPart);
    const tokenFinal = [tokenPart, signature].join('.');

    const accessToken = new AccessToken();
    accessToken.userId = request.userId;
    accessToken.identityId = request.identityid;
    accessToken.authenticator = request.authenticator;
    accessToken.token = signature;
    accessToken.expiredDate = expiredAt;
    accessToken.ipAddress = request.ipAddress;
    accessToken.userAgent = request.userAgent || undefined;
    await this.dbSession.getRepository(AccessToken).save(accessToken);

    return {
      id: accessToken.id,
      userId: request.userId,
      accessToken: tokenFinal,
    };
  }
}
