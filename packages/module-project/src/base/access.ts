import { accessManager, constants as coreConstants } from '@roxavn/core/base';

import { baseModule } from './module';
import { constants } from './constants';

export const scopes = accessManager.makeScopes(baseModule, {
  Project: { name: 'project' },
  PublicProject: {
    name: 'project',
    condition: (_, project) => project?.type === constants.ProjectTypes.PUBLIC,
  },
  Task: { name: 'task' },
  TaskAssignee: {
    name: 'task',
    condition: (request, task) => task?.assignee === request.$user?.id,
  },
});

export const permissions = accessManager.makePermissions(scopes, {
  CreateUserRole: accessManager.permissions.CreateUserRole,
  DeleteUserRole: accessManager.permissions.DeleteUserRole,
  ReadRoleUsers: accessManager.permissions.ReadRoleUsers,
  ReadRoles: accessManager.permissions.ReadRoles,

  CreateProject: {
    allowedScopes: [accessManager.scopes.AuthUser],
  },
  ReadProject: {
    allowedScopes: [scopes.Project, scopes.PublicProject],
  },
  ReadProjects: {
    allowedScopes: [accessManager.scopes.Owner],
  },
  UpdateProject: {
    allowedScopes: [scopes.Project],
  },
  DeleteProject: {
    allowedScopes: [scopes.Project],
  },

  CreateTask: { allowedScopes: [scopes.Project, scopes.TaskAssignee] },
  ReadTask: { allowedScopes: [scopes.Project, scopes.PublicProject] },
  ReadTasks: { allowedScopes: [scopes.Project] },
  UpdateProgress: { allowedScopes: [scopes.Project] },
  UpdateTaskStatus: { allowedScopes: [scopes.TaskAssignee] },
  UpdateTask: { allowedScopes: [scopes.Project, accessManager.scopes.Owner] },
  DeleteTask: { allowedScopes: [scopes.Project, accessManager.scopes.Owner] },
  AssignTask: { allowedScopes: [scopes.Project] },
  AssignMe: { allowedScopes: [scopes.Project] },
});

export const roles = accessManager.makeRoles(scopes, permissions, {
  ProjectAdmin: {
    name: coreConstants.Role.ADMIN,
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
      permissions.UpdateTask,
      permissions.AssignMe,
      permissions.AssignTask,
      permissions.ReadTasks,
      permissions.ReadTask,
    ],
  },
  ProjectMember: {
    name: coreConstants.Role.MEMBER,
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
