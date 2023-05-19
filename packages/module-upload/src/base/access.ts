import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  File: { name: 'file' },
  FileStorage: { name: 'fileStorage' },
});

export const permissions = accessManager.makePermissions(scopes, {
  ReadFIleStorages: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  CreateFIleStorages: {
    allowedScopes: [accessManager.scopes.AuthUser],
  },
  UploadFile: {
    allowedScopes: [accessManager.scopes.AuthUser],
  },
  ReadFile: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  ReadFiles: {
    allowedScopes: [accessManager.scopes.Owner],
  },
});

export const roles = accessManager.makeRoles(scopes, permissions, {});
