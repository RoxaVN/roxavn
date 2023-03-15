import { accessManager, constants } from '@roxavn/core/base';

import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {
  Project: { name: 'project' },
  Task: { name: 'task' },
});

export const permissions = accessManager.makePermissions(scopes, {
  CreateProject: {},
  ReadProject: {},
  ReadProjects: {},
  UpdateProject: {
    allowedScopes: [accessManager.scopes.Owner, scopes.Project],
  },
  DeleteProject: {
    allowedScopes: [accessManager.scopes.Owner, scopes.Project],
  },

  CreateTask: { allowedScopes: [scopes.Project] },
  ReadTask: { allowedScopes: [scopes.Project] },
  ReadTasks: { allowedScopes: [scopes.Project] },
  UpdateProgress: { allowedScopes: [scopes.Project] },
  UpdateTask: { allowedScopes: [scopes.Project, accessManager.scopes.Owner] },
  DeleteTask: { allowedScopes: [scopes.Project, accessManager.scopes.Owner] },
  AssignTask: { allowedScopes: [scopes.Project] },
  AssignMe: { allowedScopes: [scopes.Project] },
});

export const roles = accessManager.makeRoles(scopes, permissions, {
  ProjectAdmin: {
    name: constants.Role.ADMIN,
    scope: scopes.Project,
    permissions: [
      accessManager.permissions.CreateUserRole,
      accessManager.permissions.DeleteUserRole,
      accessManager.permissions.ReadRoleUsers,
      accessManager.permissions.ReadRoles,
      permissions.UpdateProject,
      permissions.DeleteProject,
      permissions.CreateTask,
      permissions.UpdateTask,
      permissions.UpdateProgress,
      permissions.DeleteTask,
      permissions.AssignTask,
      permissions.AssignMe,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
  ProjectMediator: {
    name: 'Mediator',
    scope: scopes.Project,
    permissions: [
      accessManager.permissions.ReadRoleUsers,
      accessManager.permissions.ReadRoles,
      permissions.CreateTask,
      permissions.AssignMe,
      permissions.AssignTask,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
  ProjectMember: {
    name: constants.Role.MEMBER,
    scope: scopes.Project,
    permissions: [
      accessManager.permissions.ReadRoleUsers,
      accessManager.permissions.ReadRoles,
      permissions.CreateTask,
      permissions.AssignMe,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
  ProjectJuniorMember: {
    name: 'JuniorMember',
    scope: scopes.Project,
    permissions: [
      accessManager.permissions.ReadRoleUsers,
      accessManager.permissions.ReadRoles,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
});
