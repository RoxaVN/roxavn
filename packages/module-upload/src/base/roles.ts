import { constants } from '@roxavn/core/base';
import { Scopes as UserScopes } from '@roxavn/module-user/base';

import { baseModule } from './module';

export const Scopes = {
  Module: baseModule.scope(),
};

export const Resources = {
  File: { name: 'files', idParam: 'fileId' },
  FileStorage: { name: 'file-storages', idParam: 'fileStorageId' },
};

export const Permissions = {
  ReadFIleStorages: {
    value: 'read.file.storages',
    allowedScopes: [Scopes.Module, UserScopes.Owner],
  },
  UploadFile: {
    value: 'upload.file',
    allowedScopes: [Scopes.Module, UserScopes.Owner],
  },
};

export const Roles = {
  Admin: {
    name: constants.Role.ADMIN,
    scope: Scopes.Module,
    permissions: Object.values(Permissions),
  },
};
