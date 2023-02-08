import {
  constants,
  permissionManager,
  predefinedRoleManager,
  scopeManager,
} from '@roxavn/core/base';
import { baseModule } from './module';

export const Scopes = {
  Module: {
    type: baseModule.name,
    hasId: false,
  },
};

export const Permissions = {
  AddModule: {
    value: 'add.module',
    allowedScopes: [Scopes.Module],
  },
  ActiveModule: {
    value: 'active.module',
    allowedScopes: [Scopes.Module],
  },
};

export const Roles = {
  Admin: {
    name: constants.Role.ADMIN,
    scope: Scopes.Module,
    permissions: Object.values(Permissions),
  },
};

if (!scopeManager.hasScope(Scopes.Module)) {
  scopeManager.register(...Object.values(Scopes));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
