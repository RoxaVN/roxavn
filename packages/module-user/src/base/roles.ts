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

export const Permissions = {
  CreateUser: {
    value: 'create.user',
    allowedScopes: [Scopes.Module],
  },
  ReadUser: {
    value: 'read.user',
    allowedScopes: [Scopes.Module],
  },
  ReadRole: {
    value: 'read.role',
    allowedScopes: [Scopes.Module],
  },
  ReadUserRoles: {
    value: 'read.user.roles',
    allowedScopes: [Scopes.Module],
  },
  UpdateUserRoles: {
    value: 'update.user.roles',
    allowedScopes: [Scopes.Module],
  },
};

export const Roles = {
  Admin: {
    name: constants.Role.ADMIN,
    scope: Scopes.Module,
    permissions: Object.values(Permissions),
  },
  Moderator: {
    name: constants.Role.MODERATOR,
    scope: Scopes.Module,
    permissions: [Permissions.ReadUser],
  },
};

if (!scopeManager.hasScope(Scopes.Module)) {
  scopeManager.register(...Object.values(Scopes));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
