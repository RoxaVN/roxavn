---
to: src/base/roles.ts
---
import {
  constants,
  permissionManager,
  predefinedRoleManager,
  scopeManager,
} from '@roxavn/core/base';
import { baseModule } from './module';

export const Scopes = {
  Module: baseModule.scope(),
};

export const Resources = {
  User: { name: 'users', idParam: 'userId' },
};

export const Permissions = {
  ReadUser: {
    value: 'read.user',
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
  scopeManager.register(...Object.values(Scopes), ...Object.values(Resources));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
