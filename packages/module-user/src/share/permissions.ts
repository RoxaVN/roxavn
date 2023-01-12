import {
  permissionManager,
  predefinedRoleManager,
  scopeManager,
} from '@roxavn/core/share';
import { baseModule } from './module';

export const Scopes = {
  Module: {
    type: baseModule.name,
    hasId: false,
  },
};

export const Permissions = {
  CreateUser: {
    value: 'user.create',
    allowedScopes: [Scopes.Module],
  },
  ReadUser: {
    value: 'user.read',
    allowedScopes: [Scopes.Module],
  },
  ReadUserRoles: {
    value: 'user.roles.read',
    allowedScopes: [Scopes.Module],
  },
  ManageUserModuleRoles: {
    value: 'user.module-role.manage',
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
