import {
  BadRequestException,
  InferApiRequest,
  UnauthorizedException,
} from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { constants, passwordIdentityApi } from '../../base';
import { Env } from '../config';
import { Identity } from '../entities';
import { serverModule } from '../module';
import { CreateAccessTokenService } from './access.token';
import { tokenService } from './token';

@serverModule.useApi(passwordIdentityApi.auth)
export class PasswordAuthApiService extends ApiService {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.auth>) {
    const identity = await this.dbSession.getRepository(Identity).findOne({
      select: ['id', 'userId', 'metadata'],
      where: {
        user: { username: request.username },
        type: constants.identityTypes.PASSWORD,
      },
    });

    if (!identity) {
      throw new UnauthorizedException();
    }

    const isValid =
      identity.metadata &&
      (await tokenService.hasher.verify(
        request.password,
        identity.metadata.password
      ));

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return await this.create(CreateAccessTokenService).handle({
      userId: identity.userId,
      identityid: identity.id,
      authenticator: constants.identityTypes.PASSWORD,
    });
  }
}

@serverModule.useApi(passwordIdentityApi.reset)
export class ResetPasswordApiService extends ApiService {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.reset>) {
    const identity = await this.dbSession.getRepository(Identity).findOne({
      select: ['id', 'metadata'],
      where: {
        subject: request.userId,
        type: constants.identityTypes.PASSWORD,
      },
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

    identity.metadata = { password: passwordHash };
    this.dbSession.getRepository(Identity).save(identity);

    return {};
  }
}

@serverModule.useApi(passwordIdentityApi.recovery)
export class RecoveryPasswordApiService extends ApiService {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.recovery>) {
    const token = await tokenService.creator.create({
      alphabetType: 'LOWERCASE_ALPHA_NUM',
      size: 21,
    });
    const hash = await tokenService.hasher.hash(token);
    const expiredAt = Date.now() + Env.SHORT_TIME_TO_LIVE;

    await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(Identity)
      .values({
        subject: request.userId,
        type: constants.identityTypes.PASSWORD,
        userId: request.userId,
        metadata: { token: { hash, expiredAt } } as any,
      })
      .orUpdate(['metadata'], ['id'])
      .execute();

    return { token };
  }
}
