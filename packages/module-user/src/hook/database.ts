import { type Role as RoleType } from '@roxavn/core/base';
import { TokenHasher, BaseService } from '@roxavn/core/server';
import { PasswordIdentity, Role, User, UserRole } from '../server';
import { Roles } from '../base/roles';

export class CreateAdminUserHook extends BaseService {
  async handle() {
    const count = await this.dbSession.getRepository(User).count();
    if (count < 1) {
      const identity = new PasswordIdentity();
      const tokenHasher = new TokenHasher();
      identity.password = await tokenHasher.hash('admin');
      const user = new User();
      user.username = 'admin';
      await this.dbSession.save(user);
      identity.owner = user;
      await this.dbSession.save(identity);

      const role = await this.dbSession.findOneBy(Role, {
        name: Roles.Admin.name,
        resource: Roles.Admin.resource.name,
      });
      if (role) {
        const adminRole = new UserRole();
        adminRole.owner = user;
        adminRole.role = role;
        await this.dbSession.save(adminRole);
      }
    }
  }
}

export class SetAdminRoleHook extends BaseService {
  async handle(role: RoleType) {
    const users = await this.dbSession.getRepository(UserRole).find({
      select: { ownerId: true },
      where: {
        role: {
          name: Roles.Admin.name,
          resource: Roles.Admin.resource.name,
        },
      },
    });
    const roleModel = await this.dbSession.getRepository(Role).findOneBy({
      name: role.name,
      resource: role.resource.name,
    });
    if (roleModel) {
      const adminRoles = users.map((user) => {
        const adminRole = new UserRole();
        adminRole.ownerId = user.ownerId;
        adminRole.roleId = roleModel.id;
        return adminRole;
      });
      await this.dbSession
        .createQueryBuilder()
        .insert()
        .into(UserRole)
        .values(adminRoles)
        .orIgnore()
        .execute();
    }
  }
}

export class CreateRolesHook extends BaseService {
  async handle(roles: Record<string, RoleType>) {
    const roleRepository = this.dbSession.getRepository(Role);
    for (const role of Object.values(roles)) {
      let mess = `[${role.resource.name}] `;
      let roleModel = await roleRepository.findOne({
        where: { name: role.name, resource: role.resource.name },
      });
      if (!roleModel) {
        roleModel = new Role();
        roleModel.isPredefined = true;
        roleModel.name = role.name;
        roleModel.hasId = !!role.resource.idParam;
        roleModel.resource = role.resource.name;
        mess += 'add role ';
      } else {
        mess += 'update role ';
      }
      mess += role.name;
      roleModel.permissions = role.permissions.map((p) => p.value);
      await roleRepository.save(roleModel);
      console.log(mess);
    }
  }
}
