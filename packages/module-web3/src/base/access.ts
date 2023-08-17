import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Web3EventCrawler: { name: 'web3EventCrawler' },
});

export const permissions = accessManager.makePermissions(scopes, {
  UpdateWeb3EventCrawler: {},
  ReadWeb3EventCrawlers: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
