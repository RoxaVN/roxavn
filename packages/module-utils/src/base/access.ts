import { accessManager } from '@roxavn/core/base';
import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {});

export const permissions = accessManager.makePermissions(scopes, {
  ReadSettings: {
    allowedScopes: [accessManager.scopes.DynamicModule],
  },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
