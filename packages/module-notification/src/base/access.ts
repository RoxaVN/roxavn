import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {
  Notification: { name: 'notification' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadUserNotifications: { allowedScopes: [accessManager.scopes.Owner] },
  UpdateUserNotification: { allowedScopes: [accessManager.scopes.Owner] },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
