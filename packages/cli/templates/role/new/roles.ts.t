---
to: src/share/roles.ts
---
import {
  permissionManager,
  predefinedRoleManager,
  scopeManager,
} from '@roxavn/core/share';
import { baseModule } from './module';

export const Scopes = {
  Module: {
    type: baseModule.escapedName,
    hasId: false,
  },
};

export const Permissions = {
  ReadUser: {
    value: 'user.read',
    allowedScopes: [Scopes.Module],
  },
};

export const Roles = {
  Admin: {
    name: 'Admin',
    scope: Scopes.Module,
    permissions: Object.values(Permissions),
  },
};

if (!scopeManager.hasScope(Scopes.Module)) {
  scopeManager.register(...Object.values(Scopes));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
