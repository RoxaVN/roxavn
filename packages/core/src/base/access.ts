import camelCase from 'lodash/camelCase';
import { constants } from './constants';
import { BaseModule } from './module';

export interface Scope {
  name: string;
  idParam?: string;
  dynamicName?: (request: Record<string, any>) => string;
}

export interface Resource extends Scope {
  idParam: string;
  pluralName: string;
}

export interface Permission {
  name: string;
  allowedScopes: Scope[];
}

export interface Role {
  name: string;
  scope: Scope;
  permissions: Permission[];
}

type Resources = { [key: string]: Partial<Resource> };
type Permissions = { [key: string]: Partial<Permission> };

class AccessManager {
  scopes = {
    AuthUser: { name: 'authUser' },
    Owner: { name: 'owner' },
    DynamicModule: {
      name: 'dynamicModule',
      dynamicName: (request) => request.module,
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

  makeScopes<R extends Resources>(module: BaseModule, resources: R) {
    const result: { [key in keyof R]: Resource } = Object.fromEntries(
      Object.keys(resources).map((k) => {
        const name = camelCase(k);
        return [
          k as any,
          {
            name: resources[k].name || name,
            pluralName: resources[k].pluralName || name + 's',
            idParam: resources[k].idParam || name + 'Id',
          },
        ];
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
        const allowedScopes = permissions[p].allowedScopes || [];
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

  makeRoles<R extends { [key: string]: Role }>(
    scopes: { [key: string]: Scope },
    permissions: { [key: string]: Permission },
    roles: R
  ) {
    return {
      ...roles,
      Admin: {
        name: constants.Role.ADMIN,
        scope: scopes.Module,
        permissions: Object.values(permissions),
      },
      Viewer: {
        name: constants.Role.VIEWER,
        scope: scopes.Module,
        permissions: Object.values(permissions).filter(
          (p) => p.name.startsWith('Read') || p.name.startsWith('Get')
        ),
      },
    };
  }
}

export const accessManager = new AccessManager();
