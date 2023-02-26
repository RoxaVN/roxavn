import { constants } from '@roxavn/core/base';
import { Scopes as UserScopes } from '@roxavn/module-user/base';
import { Permissions as UtilsPermissions } from '@roxavn/module-utils/base';

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
  ReadSettings: UtilsPermissions.ReadSettings,

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
