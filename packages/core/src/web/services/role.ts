import { UseListStateHandlers } from '@mantine/hooks';
import React, { useContext, useEffect, useState } from 'react';

import { Api, ApiRequest, Resource } from '../../base/index.js';
import { authService } from './auth.js';
import { resourceManager } from './resources.js';
import { authorize } from './authorize.js';

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

function makeHelper(
  roles: Array<RoleItem>,
  api: Api,
  request: Record<string, any>
) {
  const getActiveResource = () => {
    for (const r of api.resources.reverse()) {
      if (request[r.idParam]) {
        return r;
      }
    }
    return undefined;
  };

  const getResourceInstance = () => {
    const resource = getActiveResource();
    return (
      resource && resourceManager.get(resource.name, request[resource.idParam])
    );
  };

  const getRelatedResourceInstance = (resource: Resource) => {
    const activeResource = getActiveResource();
    const instance = getResourceInstance();
    if (activeResource?.name === resource.name) {
      return instance;
    }
    return (
      instance && resourceManager.get(resource.name, instance[resource.idParam])
    );
  };

  const hasPermission = (
    _: string,
    permission: string,
    scopes: Array<{ name: string; id?: string }>
  ) => {
    return !!roles.find((role) => {
      if (role.permissions.includes(permission)) {
        return scopes.find((scope) => {
          if (scope.name === role.scope) {
            if ((scope.id && scope.id === role.scopeId) || !scope.id) {
              return true;
            }
          }
          return false;
        });
      }
      return null;
    });
  };

  return {
    hasPermission,
    getResourceInstance,
    getRelatedResourceInstance,
  };
}

export const canAccessApi = <Request extends ApiRequest>(
  roles: Array<RoleItem>,
  api: Api<Request>,
  apiParams?: Record<string, any>
): boolean => {
  const permission = api?.permission;
  if (permission) {
    let request = apiParams || {};
    const tokenData = authService.getTokenData();
    if (tokenData) {
      request = { ...request, $user: { id: tokenData.userId } };
    }

    return authorize({
      api: api,
      request,
      helper: makeHelper(roles, api, request),
    }) as any;
  }
  return true;
};

export const useCanAccessApi = <Request extends ApiRequest>(
  api?: Api<Request>,
  apiParams?: Record<string, any>
) => {
  const [allow, setAllow] = useState(!api);
  const roles = useRoles();

  useEffect(() => {
    // must check in useEffect because client side gets data from localStorage
    const check = api ? canAccessApi(roles, api, apiParams) : true;
    if (check !== allow) {
      setAllow(check);
    }
  }, [api, apiParams, roles]);
  return allow;
};
