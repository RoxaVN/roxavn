import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  ModuleInfo: { name: 'module', idParam: 'moduleName' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadModules: {},
  RunHookInstall: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
