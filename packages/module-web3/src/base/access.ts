import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Web3Event: { name: 'web3Event' },
  Web3EventCrawler: { name: 'web3EventCrawler' },
  Web3Provider: { name: 'web3Provider' },
  Web3Contract: { name: 'web3Contract' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadWeb3Events: {},

  ReadWeb3Contracts: {},
  UpdateWeb3Contract: {},
  CreateWeb3Contract: {},

  CreateWeb3Provider: {},
  UpdateWeb3Provider: {},
  ReadWeb3Providers: {},

  CreateWeb3EventCrawler: {},
  UpdateWeb3EventCrawler: {},
  ReadWeb3EventCrawlers: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
