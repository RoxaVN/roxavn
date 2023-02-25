import { Scope } from '@roxavn/core/base';

export const Resources = {
  Setting: { name: 'settings', idParam: 'settingId' },
};

export const Scopes = {
  DynamicModule: {
    name: 'dynamicModule',
    dynamicName: (request) => request.module,
  } as Scope,
};

export const Permissions = {
  ReadSettings: {
    value: 'read.settings',
    allowedScopes: [Scopes.DynamicModule],
  },
};
