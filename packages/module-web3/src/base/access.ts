import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  EventCrawler: { name: 'eventCrawler' },
});

export const permissions = accessManager.makePermissions(scopes, {
  UpdateEventCrawler: {},
  ReadEventCrawlers: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
