import {
  constants,
  permissionManager,
  predefinedRoleManager,
  scopeManager,
} from '@roxavn/core/base';
import { Scopes as UserScopes } from '@roxavn/module-user/base';

import { baseModule } from './module';

export const Scopes = {
  Module: baseModule.scope(),
};

export const Resources = {
  UserInfo: { name: 'users-info', idParam: 'userId' },
};

export const Permissions = {
  UpdateSetting: {
    value: 'update.setting',
    allowedScopes: [Scopes.Module],
  },
  ReadSettings: {
    value: 'read.settings',
    allowedScopes: [Scopes.Module],
  },
  ReadUsersInfo: {
    value: 'read.users.info',
    allowedScopes: [Scopes.Module],
  },
  ReadUserInfo: {
    value: 'read.user.info',
    allowedScopes: [Scopes.Module, UserScopes.Owner],
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
