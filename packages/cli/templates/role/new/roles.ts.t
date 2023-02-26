---
to: src/base/roles.ts
---
import { constants } from '@roxavn/core/base';
import { baseModule } from './module';

export const Scopes = {
  Module: baseModule.scope(),
};

export const Resources = {
  User: { name: 'users', idParam: 'userId' },
};

export const Permissions = {
  // predefine permission for plugins use
  UpdateSetting: {
    value: 'update.setting',
    allowedScopes: [Scopes.Module],
  },
  ReadSettings: {
    value: 'read.settings',
    allowedScopes: [Scopes.Module],
  },

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
