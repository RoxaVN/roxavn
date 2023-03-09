import { hookManager } from '@roxavn/core/server';
import { CreateRolesHook, SetAdminRoleHook } from './database';

export * from './install';

hookManager.createRoleService = CreateRolesHook;
hookManager.setAdminRoleService = SetAdminRoleHook;
