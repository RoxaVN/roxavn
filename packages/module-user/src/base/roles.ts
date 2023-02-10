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
  CreateUser: {
    value: 'create.user',
    allowedResources: [Resources.Module],
  },
  ReadUser: {
    value: 'read.user',
    allowedResources: [Resources.Module],
  },
  ReadRole: {
    value: 'read.role',
    allowedResources: [Resources.Module],
  },
  ReadUserRoles: {
    value: 'read.user.roles',
    allowedResources: [Resources.Module],
  },
  UpdateUserRoles: {
    value: 'update.user.roles',
    allowedResources: [Resources.Module],
  },
};

export const Roles = {
  Admin: {
    name: constants.Role.ADMIN,
    resource: Resources.Module,
    permissions: Object.values(Permissions),
  },
  Moderator: {
    name: constants.Role.MODERATOR,
    resource: Resources.Module,
    permissions: [Permissions.ReadUser],
  },
};

if (!resourceManager.hasResource(Resources.Module)) {
  resourceManager.register(...Object.values(Resources));
  permissionManager.register(...Object.values(Permissions));
  predefinedRoleManager.register(...Object.values(Roles));
}
