import { accessManager } from '@roxavn/core/base';

export const permissions = {
  ReadSettings: {
    name: 'ReadSettings',
    allowedScopes: [accessManager.scopes.DynamicModule],
  },
};
