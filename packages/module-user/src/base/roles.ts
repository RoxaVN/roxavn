import { constants } from '@roxavn/core/base';
import { baseModule } from './module';

export const Scopes = {
  Module: baseModule.scope(),
  Owner: { name: 'owner' },
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
    allowedScopes: [Scopes.Module, Scopes.Owner],
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
    allowedScopes: [Scopes.Module, Scopes.Owner],
  },
  CreateUserRole: {
    value: 'create.user.role',
    allowedScopes: [Scopes.Module],
  },
  DeleteUserRole: {
    value: 'delete.user.role',
    allowedScopes: [Scopes.Module, Scopes.Owner],
  },

  DeleteAccessToken: {
    value: 'delete.access.token',
    allowedScopes: [Scopes.Module, Scopes.Owner],
  },
  GetAccessTokens: {
    value: 'get.access.tokens',
    allowedScopes: [Scopes.Module, Scopes.Owner],
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
