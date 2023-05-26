import {
  BadRequestException,
  type InferApiRequest,
  UnauthorizedException,
} from '@roxavn/core/base';
import {
  BaseService,
  DatabaseService,
  type InferContext,
  InjectDatabaseService,
  inject,
  Ip,
  UserAgent,
} from '@roxavn/core/server';

import { constants, passwordIdentityApi } from '../../base/index.js';
import { Env } from '../config.js';
import { Identity } from '../entities/index.js';
import { serverModule } from '../module.js';
import { CreateAccessTokenService } from './access.token.js';
import { tokenService } from './token.js';

@serverModule.useApi(passwordIdentityApi.auth)
export class AuthPasswordApiService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(CreateAccessTokenService)
    private createAccessTokenService: CreateAccessTokenService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof passwordIdentityApi.auth>,
    @Ip ipAddress: InferContext<typeof Ip>,
    @UserAgent userAgent: InferContext<typeof UserAgent>
  ) {
    const identity = await this.databaseService.manager
      .getRepository(Identity)
      .findOne({
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

    return await this.createAccessTokenService.handle({
      userId: identity.userId,
      identityid: identity.id,
      authenticator: constants.identityTypes.PASSWORD,
      ipAddress,
      userAgent,
    });
  }
}

@serverModule.useApi(passwordIdentityApi.reset)
export class ResetPasswordApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.reset>) {
    const identity = await this.entityManager.getRepository(Identity).findOne({
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
    this.entityManager.getRepository(Identity).save(identity);

    return {};
  }
}

@serverModule.useApi(passwordIdentityApi.recovery)
export class RecoveryPasswordApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof passwordIdentityApi.recovery>) {
    const token = await tokenService.creator.create({
      alphabetType: 'LOWERCASE_ALPHA_NUM',
      size: 21,
    });
    const hash = await tokenService.hasher.hash(token);
    const expiredAt = Date.now() + Env.SHORT_TIME_TO_LIVE;

    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(Identity)
      .values({
        subject: request.userId,
        type: constants.identityTypes.PASSWORD,
        userId: request.userId,
        metadata: { token: { hash, expiredAt } } as any,
      })
      .orUpdate(['metadata'], ['subject', 'type'])
      .execute();

    return { token };
  }
}
