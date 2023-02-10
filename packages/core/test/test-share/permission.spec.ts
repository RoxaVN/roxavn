import {
  permissionManager,
  predefinedRoleManager,
  resourceManager,
} from '../../src/base';

const Resources = {
  Module: {
    type: 'module',
    hasId: false,
  },
  Project: {
    type: 'project',
    hasId: true,
  },
};

const Permissions = {
  CreateProject: {
    value: 'project.create',
    allowedResources: [Resources.Module],
  },
  DeleteProject: {
    value: 'project.delete',
    allowedResources: [Resources.Module],
  },
  ReadProject: {
    value: 'project.read',
    allowedResources: [Resources.Module, Resources.Project],
  },
};

const Roles = {
  Admin: {
    name: 'Admin',
    resource: Resources.Module,
    permissions: Object.values(Permissions),
  },
  Leader: {
    name: 'Leader',
    resource: Resources.Project,
    permissions: [Permissions.ReadProject],
  },
};

resourceManager.register(...Object.values(Resources));
permissionManager.register(...Object.values(Permissions));
predefinedRoleManager.register(...Object.values(Roles));

describe('permission', () => {
  describe('resourceManager', () => {
    describe('register', () => {
      it('should throw an error when duplicate resource', () => {
        expect(() =>
          resourceManager.register({
            type: 'module',
            hasId: true,
          })
        ).toThrow('Duplicate resource type');

        expect(() =>
          resourceManager.register({
            type: 'module',
            hasId: false,
          })
        ).toThrow('Duplicate resource type');
      });
    });

    describe('getResourceTypes', () => {
      it('should work', () => {
        expect(resourceManager.getResourceTypes()).toEqual([
          'module',
          'project',
        ]);
      });
    });

    describe('hasResource', () => {
      it('should work', () => {
        expect(
          resourceManager.hasResource({
            type: 'module',
            hasId: false,
          })
        ).toBeTruthy();

        expect(
          resourceManager.hasResource({
            type: 'module',
            hasId: true,
          })
        ).toBeFalsy();
      });
    });
  });

  describe('permissionManager', () => {
    describe('register', () => {
      it('should throw an error when resource is not registered', () => {
        expect(() =>
          permissionManager.register({
            value: 'project.create',
            allowedResources: [
              {
                type: 'other-module',
                hasId: false,
              },
            ],
          })
        ).toThrow('Unregistered resource');
      });
    });

    describe('hasPermission', () => {
      it('should work', () => {
        expect(
          permissionManager.hasPermission({
            value: 'project.create',
            allowedResources: [
              {
                type: 'other-module',
                hasId: false,
              },
            ],
          })
        ).toBeFalsy();

        expect(
          permissionManager.hasPermission({
            value: 'other-project.create',
            allowedResources: [
              {
                type: 'module',
                hasId: false,
              },
            ],
          })
        ).toBeFalsy();

        expect(
          permissionManager.hasPermission(Permissions.CreateProject)
        ).toBeTruthy();
      });
    });

    describe('getPermissionsByResourceType', () => {
      it('should work', () => {
        expect(
          permissionManager.getPermissionsByResourceType(Resources.Module.type)
        ).toEqual([
          Permissions.CreateProject,
          Permissions.DeleteProject,
          Permissions.ReadProject,
        ]);

        expect(
          permissionManager.getPermissionsByResourceType(Resources.Project.type)
        ).toEqual([Permissions.ReadProject]);

        expect(permissionManager.getPermissionsByResourceType('other')).toEqual(
          []
        );
      });
    });

    describe('getPermissionValuesByResourceType', () => {
      it('should work', () => {
        expect(
          permissionManager.getPermissionValuesByResourceType(
            Resources.Module.type
          )
        ).toEqual([
          Permissions.CreateProject.value,
          Permissions.DeleteProject.value,
          Permissions.ReadProject.value,
        ]);

        expect(
          permissionManager.getPermissionValuesByResourceType(
            Resources.Project.type
          )
        ).toEqual([Permissions.ReadProject.value]);

        expect(
          permissionManager.getPermissionValuesByResourceType('other')
        ).toEqual([]);
      });
    });
  });

  describe('predefinedRoleManager', () => {
    describe('register', () => {
      it('should throw an error when resource is not registered', () => {
        expect(() =>
          predefinedRoleManager.register({
            name: 'Supporter',
            resource: {
              type: 'other-module',
              hasId: false,
            },
            permissions: [Permissions.CreateProject],
          })
        ).toThrow('Unregistered resource');
      });

      it('should throw an error when permission is not registered', () => {
        expect(() =>
          predefinedRoleManager.register({
            name: 'Supporter',
            resource: Resources.Module,
            permissions: [
              {
                value: 'other.permission',
                allowedResources: [Resources.Module],
              },
            ],
          })
        ).toThrow('Unregistered permission');
      });

      it('should throw an error when role permission resource is conflict', () => {
        expect(() =>
          predefinedRoleManager.register({
            name: 'Supporter',
            resource: Resources.Project,
            permissions: [Permissions.CreateProject],
          })
        ).toThrow('Conflict role permission resource');
      });
    });

    describe('getRolesByPermission', () => {
      it('should work', () => {
        expect(
          predefinedRoleManager.getRolesByPermission(Permissions.CreateProject)
        ).toEqual([Roles.Admin]);

        expect(
          predefinedRoleManager.getRolesByPermission(Permissions.ReadProject)
        ).toEqual([Roles.Admin, Roles.Leader]);

        expect(
          predefinedRoleManager.getRolesByPermission({
            value: 'other',
            allowedResources: [Resources.Module],
          })
        ).toEqual([]);
      });
    });

    describe('getRolesByResourceType', () => {
      it('should work', () => {
        expect(
          predefinedRoleManager.getRolesByResourceType(Resources.Module.type)
        ).toEqual([Roles.Admin]);

        expect(
          predefinedRoleManager.getRolesByResourceType(Resources.Project.type)
        ).toEqual([Roles.Leader]);

        expect(
          predefinedRoleManager.getRolesByResourceType('other-module')
        ).toEqual([]);
      });
    });
  });
});
