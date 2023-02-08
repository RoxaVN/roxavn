import {
  permissionManager,
  predefinedRoleManager,
  scopeManager,
} from '../../src/base';

const Scopes = {
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
    allowedScopes: [Scopes.Module],
  },
  DeleteProject: {
    value: 'project.delete',
    allowedScopes: [Scopes.Module],
  },
  ReadProject: {
    value: 'project.read',
    allowedScopes: [Scopes.Module, Scopes.Project],
  },
};

const Roles = {
  Admin: {
    name: 'Admin',
    scope: Scopes.Module,
    permissions: Object.values(Permissions),
  },
  Leader: {
    name: 'Leader',
    scope: Scopes.Project,
    permissions: [Permissions.ReadProject],
  },
};

scopeManager.register(...Object.values(Scopes));
permissionManager.register(...Object.values(Permissions));
predefinedRoleManager.register(...Object.values(Roles));

describe('permission', () => {
  describe('scopeManager', () => {
    describe('register', () => {
      it('should throw an error when duplicate scope', () => {
        expect(() =>
          scopeManager.register({
            type: 'module',
            hasId: true,
          })
        ).toThrow('Duplicate scope type');

        expect(() =>
          scopeManager.register({
            type: 'module',
            hasId: false,
          })
        ).toThrow('Duplicate scope type');
      });
    });

    describe('getScopeTypes', () => {
      it('should work', () => {
        expect(scopeManager.getScopeTypes()).toEqual(['module', 'project']);
      });
    });

    describe('hasScope', () => {
      it('should work', () => {
        expect(
          scopeManager.hasScope({
            type: 'module',
            hasId: false,
          })
        ).toBeTruthy();

        expect(
          scopeManager.hasScope({
            type: 'module',
            hasId: true,
          })
        ).toBeFalsy();
      });
    });
  });

  describe('permissionManager', () => {
    describe('register', () => {
      it('should throw an error when scope is not registered', () => {
        expect(() =>
          permissionManager.register({
            value: 'project.create',
            allowedScopes: [
              {
                type: 'other-module',
                hasId: false,
              },
            ],
          })
        ).toThrow('Unregistered scope');
      });
    });

    describe('hasPermission', () => {
      it('should work', () => {
        expect(
          permissionManager.hasPermission({
            value: 'project.create',
            allowedScopes: [
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
            allowedScopes: [
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

    describe('getPermissionsByScopeType', () => {
      it('should work', () => {
        expect(
          permissionManager.getPermissionsByScopeType(Scopes.Module.type)
        ).toEqual([
          Permissions.CreateProject,
          Permissions.DeleteProject,
          Permissions.ReadProject,
        ]);

        expect(
          permissionManager.getPermissionsByScopeType(Scopes.Project.type)
        ).toEqual([Permissions.ReadProject]);

        expect(permissionManager.getPermissionsByScopeType('other')).toEqual(
          []
        );
      });
    });

    describe('getPermissionValuesByScopeType', () => {
      it('should work', () => {
        expect(
          permissionManager.getPermissionValuesByScopeType(Scopes.Module.type)
        ).toEqual([
          Permissions.CreateProject.value,
          Permissions.DeleteProject.value,
          Permissions.ReadProject.value,
        ]);

        expect(
          permissionManager.getPermissionValuesByScopeType(Scopes.Project.type)
        ).toEqual([Permissions.ReadProject.value]);

        expect(
          permissionManager.getPermissionValuesByScopeType('other')
        ).toEqual([]);
      });
    });
  });

  describe('predefinedRoleManager', () => {
    describe('register', () => {
      it('should throw an error when scope is not registered', () => {
        expect(() =>
          predefinedRoleManager.register({
            name: 'Supporter',
            scope: {
              type: 'other-module',
              hasId: false,
            },
            permissions: [Permissions.CreateProject],
          })
        ).toThrow('Unregistered scope');
      });

      it('should throw an error when permission is not registered', () => {
        expect(() =>
          predefinedRoleManager.register({
            name: 'Supporter',
            scope: Scopes.Module,
            permissions: [
              {
                value: 'other.permission',
                allowedScopes: [Scopes.Module],
              },
            ],
          })
        ).toThrow('Unregistered permission');
      });

      it('should throw an error when role permission scope is conflict', () => {
        expect(() =>
          predefinedRoleManager.register({
            name: 'Supporter',
            scope: Scopes.Project,
            permissions: [Permissions.CreateProject],
          })
        ).toThrow('Conflict role permission scope');
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
            allowedScopes: [Scopes.Module],
          })
        ).toEqual([]);
      });
    });

    describe('getRolesByScopeType', () => {
      it('should work', () => {
        expect(
          predefinedRoleManager.getRolesByScopeType(Scopes.Module.type)
        ).toEqual([Roles.Admin]);

        expect(
          predefinedRoleManager.getRolesByScopeType(Scopes.Project.type)
        ).toEqual([Roles.Leader]);

        expect(
          predefinedRoleManager.getRolesByScopeType('other-module')
        ).toEqual([]);
      });
    });
  });
});
