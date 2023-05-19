import { BaseService } from '@roxavn/core/server';
import { Identity } from '../entities/index.js';
import { CreateAccessTokenService } from './access.token.js';
import { tokenService } from './token.js';
import { CreateUserApiService } from './user.js';

export class IdentityService extends BaseService {
  async handle(request: {
    subject: string;
    type: string;
    authenticator: string;
    userAgent?: string | null;
    ipAddress: string;
  }) {
    let identity = await this.dbSession.getRepository(Identity).findOne({
      select: ['id', 'userId'],
      where: { subject: request.subject, type: request.type },
    });

    if (!identity) {
      // random username
      const username =
        (await tokenService.creator.create({
          alphabetType: 'LOWERCASE_ALPHA',
          size: 1,
        })) +
        (await tokenService.creator.create({
          alphabetType: 'LOWERCASE_ALPHA_NUM',
          size: 15,
        }));
      const user = await this.create(CreateUserApiService).handle({
        username: username,
      });
      identity = new Identity();
      identity.type = request.type;
      identity.subject = request.subject;
      identity.userId = user.id;
      await this.dbSession.save(identity);
    }

    return this.create(CreateAccessTokenService).handle({
      identityid: identity.id,
      userId: identity.userId,
      authenticator: request.authenticator,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
    });
  }
}
