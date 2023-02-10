import {
  constants,
  permissionManager,
  predefinedRoleManager,
  resourceManager,
} from '@roxavn/core/base';
import { baseModule } from './module';

export const Resources = {
  Module: {
    type: baseModule.name,
    hasId: false,
  },
};

export const Permissions = {
  ReadUserFIles: {
    value: 'read.user.files',
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
