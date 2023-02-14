import {
  BadRequestException,
  InferApiRequest,
  UnauthorizedException,
} from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { passwordIdentityApi } from '../../base';
import { PasswordIdentity } from '../entities';
import { serverModule } from '../module';
import { CreateAccessTokenService } from './access.token';
import { tokenService } from './token';

@serverModule.useApi(passwordIdentityApi.auth)
export class PasswordAuthApiService extends ApiService<
  typeof passwordIdentityApi.auth
> {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.auth>) {
    const identity = await this.dbSession
      .getRepository(PasswordIdentity)
      .findOne({
        select: ['id', 'userId', 'password'],
        where: { user: { username: request.username } },
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

    const tokenResult = await this.create(CreateAccessTokenService).handle({
      userId: identity.userId,
      identityid: identity.id,
    });

    return { ...tokenResult, userId: identity.userId };
  }
}

@serverModule.useApi(passwordIdentityApi.reset)
export class ResetPasswordApiService extends ApiService<
  typeof passwordIdentityApi.reset
> {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.reset>) {
    const identity = await this.dbSession
      .getRepository(PasswordIdentity)
      .findOne({
        select: ['id', 'metadata'],
        where: { user: { username: request.username } },
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
    this.dbSession.getRepository(PasswordIdentity).save(identity);

    return {};
  }
}
