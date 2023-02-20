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
  Role: { name: 'roles', idParam: 'roleId' },
  AccessToken: { name: 'access-tokens', idParam: 'accessTokenId' },
  PasswordIdentity: {
    name: 'password-identity',
    idParam: 'passwordIdentityId',
  },
};

export const Permissions = {
  CreateUser: {
    value: 'create.user',
    allowedScopes: [Scopes.Module],
  },
  ReadUser: {
    value: 'read.user',
    allowedScopes: [Scopes.Module, scopeManager.OWNER],
  },
  ReadUsers: {
    value: 'read.users',
    allowedScopes: [Scopes.Module],
  },

  ReadRoles: {
    value: 'read.roles',
    allowedScopes: [Scopes.Module],
  },

  ReadUserRoles: {
    value: 'read.user.roles',
    allowedScopes: [Scopes.Module, scopeManager.OWNER],
  },
  CreateUserRole: {
    value: 'create.user.role',
    allowedScopes: [Scopes.Module],
  },
  DeleteUserRole: {
    value: 'delete.user.role',
    allowedScopes: [Scopes.Module, scopeManager.OWNER],
  },

  DeleteAccessToken: {
    value: 'delete.access.token',
    allowedScopes: [Scopes.Module, scopeManager.OWNER],
  },
  GetAccessTokens: {
    value: 'get.access.tokens',
    allowedScopes: [Scopes.Module, scopeManager.OWNER],
  },

  RecoveryPassword: {
    value: 'recovery.password',
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
  scopeManager.register(...Object.values(Scopes), ...Object.values(Resources));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
