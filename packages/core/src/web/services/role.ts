import { UseListStateHandlers } from '@mantine/hooks';
import React, { useContext } from 'react';

import { Api, ApiRequest, accessManager } from '../../base';
import { authService } from './auth';

export interface RoleItem {
  scope: string;
  scopeId?: string;
  permissions: string[];
  name: string;
  id: number;
}

export const RolesContext = React.createContext<{
  roles: Array<RoleItem>;
  handlers: UseListStateHandlers<RoleItem>;
}>({} as any);

export const useRoles = () => useContext(RolesContext).roles;

export const canAccessApi = <Request extends ApiRequest>(
  roles: Array<RoleItem>,
  api: Api<Request>,
  apiParams?: Record<string, any>
) => {
  const permission = api?.permission;
  if (permission?.allowedScopes.includes(accessManager.scopes.AuthUser)) {
    if (authService.isAuthenticated()) {
      return true;
    }
  }
  return permission
    ? permission.allowedScopes.some((scope) => {
        const scopeName = scope.dynamicName
          ? scope.dynamicName(apiParams || {})
          : scope.name;
        return (
          roles.findIndex((role) => {
            if (role.permissions.indexOf(permission.name) < 0) {
              return false;
            }
            if (role.scope !== scopeName) {
              return false;
            }
            if (scope.idParam) {
              if (!apiParams || apiParams[scope.idParam] !== role.scopeId) {
                return false;
              }
            }
            return true;
          }) > -1
        );
      })
    : true;
};

export const useCanAccessApi = <Request extends ApiRequest>(
  api?: Api<Request>,
  apiParams?: Record<string, any>
) => {
  return api ? canAccessApi(useRoles(), api, apiParams) : true;
};
