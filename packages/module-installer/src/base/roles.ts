import {
  constants,
  permissionManager,
  predefinedRoleManager,
  resourceManager,
} from '@roxavn/core/base';
import { baseModule } from './module';

export const Resources = {
  Module: {
    name: baseModule.name,
  },
};

export const Permissions = {
  AddModule: {
    value: 'add.module',
    allowedResources: [Resources.Module],
  },
  ActiveModule: {
    value: 'active.module',
    allowedResources: [Resources.Module],
  },
};

export const Roles = {
  Admin: {
    name: constants.Role.ADMIN,
    resource: Resources.Module,
    permissions: Object.values(Permissions),
  },
};

if (!resourceManager.hasResource(Resources.Module)) {
  resourceManager.register(...Object.values(Resources));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
