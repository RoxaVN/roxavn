import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {
  Project: { name: 'project' },
  Task: { name: 'task' },
});

export const permissions = accessManager.makePermissions(scopes, {
  CreateProject: {},
  UpdateProject: {
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
    name: 'Admin',
    scope: scopes.Project,
    permissions: [
      accessManager.permissions.CreateUserRole,
      accessManager.permissions.DeleteUserRole,
      permissions.UpdateProject,
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
      permissions.CreateTask,
      permissions.AssignMe,
      permissions.AssignTask,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
  ProjectMember: {
    name: 'Member',
    scope: scopes.Project,
    permissions: [
      permissions.CreateTask,
      permissions.AssignMe,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
  ProjectJuniorMember: {
    name: 'JuniorMember',
    scope: scopes.Project,
    permissions: [permissions.ReadTasks, permissions.ReadTask],
  },
});
