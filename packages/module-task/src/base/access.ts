import { accessManager, constants } from '@roxavn/core/base';

import { baseModule } from './module';

export const scopes = accessManager.makeScopes(baseModule, {
  Project: { name: 'project' },
  Task: { name: 'task' },
});

export const permissions = accessManager.makePermissions(scopes, {
  CreateProject: {},
  ReadProject: {},
  ReadProjects: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  UpdateProject: {
    allowedScopes: [accessManager.scopes.Owner, scopes.Project],
  },
  DeleteProject: {
    allowedScopes: [accessManager.scopes.Owner, scopes.Project],
  },

  CreateUserRole: accessManager.permissions.CreateUserRole,
  DeleteUserRole: accessManager.permissions.DeleteUserRole,
  ReadRoleUsers: accessManager.permissions.ReadRoleUsers,
  ReadRoles: accessManager.permissions.ReadRoles,

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
      permissions.CreateUserRole,
      permissions.DeleteUserRole,
      permissions.ReadRoleUsers,
      permissions.ReadRoles,
      permissions.UpdateProject,
      permissions.DeleteProject,
      permissions.ReadProject,
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
      permissions.ReadRoleUsers,
      permissions.ReadRoles,
      permissions.ReadProject,
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
      permissions.ReadRoleUsers,
      permissions.ReadRoles,
      permissions.ReadProject,
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
      permissions.ReadRoleUsers,
      permissions.ReadRoles,
      permissions.ReadProject,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
});
