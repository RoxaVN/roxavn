import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  UserInfo: { name: 'userInfo', idParam: 'userId' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadUsersInfo: { allowedScopes: [accessManager.scopes.AuthUser] },
  ReadUserInfo: { allowedScopes: [accessManager.scopes.Owner] },
  UpdateUserInfo: { allowedScopes: [accessManager.scopes.Owner] },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
