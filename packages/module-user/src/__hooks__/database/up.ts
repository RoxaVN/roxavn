import { databaseManager, TokenHasher } from '@roxavn/core/server';
import { DataSource } from 'typeorm';
import { PasswordIdentity, Role, User, UserRole } from '../../server';
import { Roles } from '../../share/permissions';

export const up = async () => {
  await createRoles(databaseManager.dataSource);
  await createAdminUser(databaseManager.dataSource);
};

const createAdminUser = async (dataSource: DataSource) => {
  const count = await dataSource.getRepository(User).count();
  if (count < 1) {
    await dataSource.transaction(async (manager) => {
      const identity = new PasswordIdentity();
      identity.email = 'admin@example.com';
      const tokenHasher = new TokenHasher();
      identity.password = await tokenHasher.hash('admin');
      const user = new User();
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

const createRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);
  if ((await roleRepository.count()) < 1) {
    const roles = Object.values(Roles).map((r) => {
      const role = new Role();
      role.isPredefined = true;
      role.name = r.name;
      role.scope = r.scope.type;
      role.permissions = r.permissions.map((p) => p.value);
      return role;
    });
    roleRepository.save(roles);
  }
};
