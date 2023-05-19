import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Notification: { name: 'notification' },
  NotificationToken: { name: 'notificationToken' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadUserNotifications: { allowedScopes: [accessManager.scopes.Owner] },
  UpdateUserNotification: { allowedScopes: [accessManager.scopes.Owner] },
  CreateNotificationToken: {
    allowedScopes: [accessManager.scopes.AuthUser],
  },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
