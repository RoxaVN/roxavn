import camelCase from 'lodash/camelCase';
import { constants } from './constants';
import { BaseModule } from './module';

export interface Scope {
  name: string;
  idParam?: string;
  dynamicName?: (
    request: Record<string, any>,
    resource?: Record<string, any> | null
  ) => string;
}

export interface Resource extends Scope {
  idParam: string;
  pluralName: string;
  condition?: (
    request: Record<string, any>,
    resource?: Record<string, any> | null
  ) => boolean;
}

export interface Permission {
  name: string;
  allowedScopes: (Scope | Resource)[];
}

export interface Role {
  name: string;
  scope: Scope;
  module: string;
  permissions: Permission[];
}

type Resources = { [key: string]: Partial<Resource> };
type Permissions = { [key: string]: Partial<Permission> };

class AccessManager {
  scopes = {
    Custom: { name: 'custom' },
    AuthUser: { name: 'authUser' },
    Owner: { name: 'owner' },
    DynamicModule: {
      name: 'dynamicModule',
      dynamicName: (request) => request.module,
    } as Scope,
    DynamicScope: {
      name: 'dynamicScope',
      idParam: 'scopeId',
      dynamicName: (request, resource) => {
        if (request.scope) {
          return request.scope;
        } else if (resource) {
          return resource.scope;
        }
      },
    } as Scope,
    Setting: {
      name: 'setting',
      idParam: 'settingId',
      pluralName: 'settings',
    } as Resource,
    User: {
      name: 'user',
      idParam: 'userId',
      pluralName: 'users',
    } as Resource,
  };

  permissions = {
    CreateUserRole: {
      name: 'CreateUserRole',
      allowedScopes: [this.scopes.DynamicScope, this.scopes.DynamicModule],
    },
    DeleteUserRole: {
      name: 'DeleteUserRole',
      allowedScopes: [
        this.scopes.DynamicScope,
        this.scopes.DynamicModule,
        this.scopes.Owner,
      ],
    },
    ReadRoleUsers: {
      name: 'ReadRoleUsers',
      allowedScopes: [this.scopes.DynamicScope, this.scopes.DynamicModule],
    },
    ReadRoles: {
      name: 'ReadRoles',
      allowedScopes: [this.scopes.DynamicScope, this.scopes.DynamicModule],
    },
  };

  makeScopes<R extends Resources>(module: BaseModule, resources: R) {
    const result: { [key in keyof R]: Resource } = Object.fromEntries(
      Object.keys(resources).map((k) => {
        const name = resources[k].name || camelCase(k);
        const resource: Resource = {
          name,
          pluralName: resources[k].pluralName || name + 's',
          idParam: resources[k].idParam || name + 'Id',
          condition: resources[k].condition,
        };
        return [k, , resource];
      })
    );

    return {
      Module: { name: module.name },
      ...result,
    };
  }

  makePermissions<P extends Permissions>(
    scopes: { [key: string]: Scope },
    permissions: P
  ): {
    [key in keyof P | 'UpdateSetting' | 'ReadSettings']: Permission;
  } {
    const result: { [key in keyof P]: Permission } = Object.fromEntries(
      Object.keys(permissions).map((p) => {
        const allowedScopes = [...(permissions[p].allowedScopes || [])];
        allowedScopes.push(scopes.Module);
        return [
          p as any,
          {
            name: permissions[p].name || p,
            allowedScopes: allowedScopes,
          },
        ];
      })
    );

    return {
      UpdateSetting: {
        name: 'UpdateSetting',
        allowedScopes: [scopes.Module],
      },
      ReadSettings: {
        name: 'ReadSettings',
        allowedScopes: [scopes.Module],
      },
      ...result,
    };
  }

  makeRoles<R extends { [key: string]: Omit<Role, 'module'> }>(
    scopes: { [key: string]: Scope },
    permissions: { [key: string]: Permission },
    roles: R
  ) {
    const result: { [key in keyof R]: Role } = Object.fromEntries(
      Object.keys(roles).map((k) => {
        return [
          k as any,
          {
            module: scopes.Module.name,
            ...roles[k],
          },
        ];
      })
    );

    return {
      ...result,
      Admin: {
        name: constants.Role.ADMIN,
        scope: scopes.Module,
        permissions: Object.values(permissions),
        module: scopes.Module.name,
      },
      Viewer: {
        name: constants.Role.VIEWER,
        scope: scopes.Module,
        module: scopes.Module.name,
        permissions: Object.values(permissions).filter(
          (p) => p.name.startsWith('Read') || p.name.startsWith('Get')
        ),
      },
    };
  }
}

export const accessManager = new AccessManager();
