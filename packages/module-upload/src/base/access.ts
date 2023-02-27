import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {
  File: { name: 'files' },
  FileStorage: { name: 'fileStorage' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadFIleStorages: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  UploadFile: {
    allowedScopes: [accessManager.scopes.Owner],
  },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
