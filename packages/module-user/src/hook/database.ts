import { type Role as RoleType } from '@roxavn/core/base';
import { TokenHasher, BaseService } from '@roxavn/core/server';
import { Identity, Role, User, UserRole } from '../server';
import { roles } from '../base/access';
import { constants } from '../base';

export class CreateAdminUserHook extends BaseService {
  async handle() {
    const count = await this.dbSession.getRepository(User).count();
    if (count < 1) {
      const identity = new Identity();
      const tokenHasher = new TokenHasher();
      identity.metadata = {
        password: await tokenHasher.hash('admin'),
      };
      const user = new User();
      user.username = 'admin';
      await this.dbSession.save(user);
      identity.user = user;
      identity.subject = user.id;
      identity.type = constants.identityTypes.PASSWORD;
      await this.dbSession.save(identity);

      const role = await this.dbSession.findOneBy(Role, {
        name: roles.Admin.name,
        scope: roles.Admin.scope.name,
      });
      if (role) {
        const adminRole = new UserRole();
        adminRole.user = user;
        adminRole.role = role;
        adminRole.scope = role.scope;
        await this.dbSession.save(adminRole);
      }
    }
  }
}

export class SetAdminRoleHook extends BaseService {
  async handle(role: RoleType) {
    const users = await this.dbSession.getRepository(UserRole).find({
      select: { userId: true },
      where: {
        role: {
          name: roles.Admin.name,
          scope: roles.Admin.scope.name,
        },
      },
    });
    const roleModel = await this.dbSession.getRepository(Role).findOneBy({
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
      await this.dbSession
        .createQueryBuilder()
        .insert()
        .into(UserRole)
        .values(adminroles)
        .orIgnore()
        .execute();
    }
  }
}

export class CreateRolesHook extends BaseService {
  async handle(roles: Record<string, RoleType>) {
    const roleRepository = this.dbSession.getRepository(Role);
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
