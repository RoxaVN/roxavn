import { ApiService, BaseService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/base';

import { accessTokenApi } from '../../base';
import { UserAccessToken } from '../entities';
import { serverModule } from '../module';
import { tokenService } from './token';
import { Env } from '../config';

@serverModule.useApi(accessTokenApi.delete)
export class DeleteAccessTokenApiService extends ApiService<
  typeof accessTokenApi.delete
> {
  async handle(request: InferApiRequest<typeof accessTokenApi.delete>) {
    await this.dbSession
      .getRepository(UserAccessToken)
      .delete({ id: request.accessTokenId });
    return {};
  }
}

export class CreateAccessTokenService extends BaseService {
  async handle(request: { userId: number; identityid: number }) {
    const token = await tokenService.creator.create({
      alphabetType: 'ALPHA_NUM',
      size: 21,
    });
    const expiredAt = new Date(Date.now() + Env.ACCESS_TOKEN_TIME_TO_LIVE);
    const tokenPart = [expiredAt.getTime(), request.userId, token].join('.');
    const signature = tokenService.signer.sign(tokenPart);
    const tokenFinal = [tokenPart, signature].join('.');

    const accessToken = new UserAccessToken();
    accessToken.userId = request.userId;
    accessToken.identityId = request.identityid;
    accessToken.token = signature;
    accessToken.expiredDate = expiredAt;
    this.dbSession.getRepository(UserAccessToken).save(accessToken);

    return {
      id: accessToken.id,
      accessToken: tokenFinal,
    };
  }
}
