import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Web3EventCrawler: { name: 'web3EventCrawler' },
  Web3Network: { name: 'web3Network' },
});

export const permissions = accessManager.makePermissions(scopes, {
  UpdateWeb3EventCrawler: {},
  ReadWeb3EventCrawlers: {},

  ReadWeb3Networks: {},
  UpdateWeb3Networks: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
