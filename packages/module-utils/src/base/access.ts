import { accessManager } from '@roxavn/core/base';
import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Translation: { name: 'translation' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadSettings: {
    allowedScopes: [accessManager.scopes.DynamicModule],
  },
  CreateTranslation: {},
  UpdateTranslation: {},
  ReadTranslations: {},
  ReadTranslation: {},
  DeleteTranslation: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
