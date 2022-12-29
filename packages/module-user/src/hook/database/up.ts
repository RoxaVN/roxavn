import { type Role as RoleType } from '@roxavn/core/share';
import { databaseManager, TokenHasher } from '@roxavn/core/server';
import { DataSource } from 'typeorm';
import { PasswordIdentity, Role, User, UserRole } from '../../server';
import { Roles } from '../../share/permissions';

export const up = async () => {
  await createRoles(databaseManager.dataSource, Roles);
  await createAdminUser(databaseManager.dataSource);
};

const createAdminUser = async (dataSource: DataSource) => {
  const count = await dataSource.getRepository(User).count();
  if (count < 1) {
    await dataSource.transaction(async (manager) => {
      const identity = new PasswordIdentity();
      const tokenHasher = new TokenHasher();
      identity.password = await tokenHasher.hash('admin');
      const user = new User();
      user.username = 'admin';
      await manager.save(user);
      identity.owner = user;
      await manager.save(identity);

      const role = await manager.findOneBy(Role, {
        name: Roles.Admin.name,
        scope: Roles.Admin.scope.type,
      });
      if (role) {
        const adminRole = new UserRole();
        adminRole.owner = user;
        adminRole.role = role;
        await manager.save(adminRole);
      }
    });
  }
};

export const setAdminRole = async (dataSource: DataSource, role: RoleType) => {
  const users = await dataSource.getRepository(UserRole).find({
    select: { ownerId: true },
    where: {
      role: {
        name: Roles.Admin.name,
        scope: Roles.Admin.scope.type,
      },
    },
  });
  const roleModel = await dataSource.getRepository(Role).findOneBy({
    name: role.name,
    scope: role.scope.type,
  });
  if (roleModel) {
    const adminRoles = users.map((user) => {
      const adminRole = new UserRole();
      adminRole.ownerId = user.ownerId;
      adminRole.roleId = roleModel.id;
      return adminRole;
    });
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values(adminRoles)
      .orIgnore()
      .execute();
  }
};

export const createRoles = async (
  dataSource: DataSource,
  roles: Record<string, RoleType>
) => {
  const roleRepository = dataSource.getRepository(Role);
  for (const role of Object.values(roles)) {
    const count = await roleRepository.count({
      where: { name: role.name, scope: role.scope.type },
    });
    if (count < 1) {
      const roleModel = new Role();
      roleModel.isPredefined = true;
      roleModel.name = role.name;
      roleModel.scope = role.scope.type;
      roleModel.permissions = role.permissions.map((p) => p.value);
      await roleRepository.save(roleModel);
    }
  }
};
