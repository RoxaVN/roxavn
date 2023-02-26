import { constants } from '@roxavn/core/base';
import { baseModule } from './module';

export const Scopes = {
  Module: baseModule.scope(),
};

export const Permissions = {
  AddModule: {
    value: 'add.module',
    allowedScopes: [Scopes.Module],
  },
  ActiveModule: {
    value: 'active.module',
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
