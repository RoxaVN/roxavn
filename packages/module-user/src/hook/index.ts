import { hookManager } from '@roxavn/core/server';
import { CreateRolesHook, SetAdminRoleHook } from './database.js';

export * from './install.js';

hookManager.createRoleService = CreateRolesHook;
hookManager.setAdminRoleService = SetAdminRoleHook;
