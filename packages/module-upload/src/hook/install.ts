import { databaseManager } from '@roxavn/core/server';
import { createRoles, setAdminRole } from '@roxavn/module-user/hook';

import { Roles } from '../share/permissions';

export async function install() {
  await createRoles(databaseManager.dataSource, Roles);
  await setAdminRole(databaseManager.dataSource, Roles.Admin);
}
