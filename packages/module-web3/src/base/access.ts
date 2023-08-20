import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Web3EventCrawler: { name: 'web3EventCrawler' },
  Web3Network: { name: 'web3Network' },
  Web3Contract: { name: 'web3Contract' },
});

export const permissions = accessManager.makePermissions(scopes, {
  CreateWeb3EventCrawler: {},
  ReadWeb3Contracts: {},
  UpdateWeb3Contract: {},
  CreateWeb3Contract: {},

  CreateWeb3Network: {},
  UpdateWeb3Network: {},
  ReadWeb3Networks: {},

  UpdateWeb3EventCrawler: {},
  ReadWeb3EventCrawlers: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
