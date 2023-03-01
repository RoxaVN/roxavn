import { accessManager } from '@roxavn/core/base';
import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {
  User: { name: 'user' },
  Role: { name: 'role' },
  AccessToken: { name: 'accessToken' },
  Identity: { name: 'identity' },
  PasswordIdentity: { name: 'passwordIdentity' },
});

export const permissions = accessManager.makePermissions(scopes, {
  CreateUser: {},
  ReadUsers: {},
  ReadUser: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  ReadRoles: {},
  ReadUserRoles: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  CreateUserRole: {},
  DeleteUserRole: {
    allowedScopes: [accessManager.scopes.Owner],
  },

  DeleteAccessToken: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  ReadAccessTokens: {
    allowedScopes: [accessManager.scopes.Owner],
  },

  RecoveryPassword: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
