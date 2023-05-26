import { type Role as RoleType } from '@roxavn/core/base';
import {
  TokenHasher,
  InjectDatabaseService,
  CreateRoleService,
  SetAdminRoleService,
} from '@roxavn/core/server';
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

@serverModule.rebind(SetAdminRoleService)
export class SetAdminRoleHook
  extends InjectDatabaseService
  implements SetAdminRoleService
{
  async handle(role: RoleType) {
    const users = await this.entityManager.getRepository(UserRole).find({
      select: { userId: true },
      where: {
        role: {
          name: roles.Admin.name,
          scope: roles.Admin.scope.name,
        },
      },
    });
    const roleModel = await this.entityManager.getRepository(Role).findOneBy({
      name: role.name,
      scope: role.scope.name,
    });
    if (roleModel) {
      const adminroles = users.map((user) => {
        const adminRole = new UserRole();
        adminRole.userId = user.userId;
        adminRole.roleId = roleModel.id;
        adminRole.scope = roleModel.scope;
        return adminRole;
      });
      await this.entityManager
        .createQueryBuilder()
        .insert()
        .into(UserRole)
        .values(adminroles)
        .orIgnore()
        .execute();
    }
  }
}

@serverModule.rebind(CreateRoleService)
export class CreateRolesHook
  extends InjectDatabaseService
  implements CreateRoleService
{
  async handle(roles: Record<string, RoleType>) {
    const roleRepository = this.entityManager.getRepository(Role);
    for (const role of Object.values(roles)) {
      let mess = `[${role.scope.name}] `;
      let roleModel = await roleRepository.findOne({
        where: { name: role.name, scope: role.scope.name },
      });
      if (!roleModel) {
        roleModel = new Role();
        roleModel.isPredefined = true;
        roleModel.name = role.name;
        roleModel.module = role.module;
        roleModel.hasId = !!role.scope.idParam;
        roleModel.scope = role.scope.name;
        mess += 'add role ';
      } else {
        mess += 'update role ';
      }
      mess += role.name;
      roleModel.permissions = role.permissions.map((p) => p.name);
      await roleRepository.save(roleModel);
      console.log(mess);
    }
  }
}
