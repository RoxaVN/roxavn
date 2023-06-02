import { TokenHasher, InjectDatabaseService } from '@roxavn/core/server';
import {
  Identity,
  Role,
  User,
  UserRole,
  serverModule,
} from '../server/index.js';
import { roles } from '../base/access.js';
import { constants } from '../base/index.js';

@serverModule.injectable()
export class CreateAdminUserHook extends InjectDatabaseService {
  async handle() {
    const count = await this.entityManager.getRepository(User).count();
    if (count < 1) {
      const identity = new Identity();
      const tokenHasher = new TokenHasher();
      identity.metadata = {
        password: await tokenHasher.hash('admin'),
      };
      const user = new User();
      user.username = 'admin';
      await this.entityManager.save(user);
      identity.user = user;
      identity.subject = user.id;
      identity.type = constants.identityTypes.PASSWORD;
      await this.entityManager.save(identity);

      const role = await this.entityManager.findOneBy(Role, {
        name: roles.Admin.name,
        scope: roles.Admin.scope.name,
      });
      if (role) {
        const adminRole = new UserRole();
        adminRole.user = user;
        adminRole.role = role;
        adminRole.scope = role.scope;
        await this.entityManager.save(adminRole);
      }
    }
  }
}
