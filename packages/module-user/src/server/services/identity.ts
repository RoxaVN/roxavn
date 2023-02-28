import { BaseService } from '@roxavn/core/server';
import { Identity } from '../entities';
import { CreateAccessTokenService } from './access.token';
import { CreateUserApiService } from './user';

export class IdentityService extends BaseService {
  async handle(request: {
    id: string;
    type: string;
    email?: string;
    phone?: string;
  }) {
    let identity = await this.dbSession.getRepository(Identity).findOne({
      select: ['id', 'userId'],
      where: request.email
        ? { email: request.email }
        : request.phone
        ? { phone: request.phone }
        : { id: request.id },
    });

    if (!identity) {
      const user = await this.create(CreateUserApiService).handle({
        username: request.id,
      });
      identity = new Identity();
      identity.id = request.id;
      identity.email = request.email;
      identity.phone = request.phone;
      identity.userId = user.id;
      await this.dbSession.save(identity);
    }

    return this.create(CreateAccessTokenService).handle({
      identityid: identity.id,
      userId: identity.userId,
      identityType: request.type,
    });
  }
}
