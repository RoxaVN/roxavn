import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Store: { name: 'store' },
  Asset: { name: 'asset' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadStoreAssets: {
    allowedScopes: [accessManager.scopes.ResourceOwner(scopes.Store.name)],
  },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
