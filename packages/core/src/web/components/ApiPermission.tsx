import { useListState, UseListStateHandlers } from '@mantine/hooks';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { accessManager, Api, ApiRequest, Collection } from '../../base';
import { apiFetcher, authService, userService, RoleItem } from '../services';
import { useAuthUser } from '../hooks';

export const RolesContext = React.createContext<{
  roles: Array<RoleItem>;
  handlers: UseListStateHandlers<RoleItem>;
}>({} as any);

export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const [roles, handlers] = useListState<RoleItem>([]);

  useEffect(() => {
    const sub = authService.authObserver.subscribe((data) => {
      if (!data) {
        // if logout, reset roles
        handlers.setState([]);
      }
    });
    return () => sub.unsubscribe();
  });

  return (
    <RolesContext.Provider value={{ roles, handlers }}>
      {children}
    </RolesContext.Provider>
  );
};

interface ApiRolesGetterProps<Request extends ApiRequest> {
  children?: React.ReactElement;
  api?: Api<Request, Collection<RoleItem>>;
  apiParams?: Request | { scope: string; scopeId: string };
}

export const ApiRolesGetter = <Request extends ApiRequest>({
  children,
  api,
  apiParams,
}: ApiRolesGetterProps<Request>) => {
  const user = useAuthUser();
  const [load, setLoad] = useState(false);
  const { roles, handlers } = useContext(RolesContext);

  async function getRoles() {
    try {
      if (user) {
        const _api = api || userService.getUserRolesApi;
        if (!_api) {
          throw new Error(
            'ApiRolesGetter: must define api prop or userService.getUserRolesApi'
          );
        }
        const data = await apiFetcher.fetch(_api, {
          ...apiParams,
          userId: user.id,
        } as any);
        const newRoles = data.items.filter(
          (item) =>
            !roles.find(
              (role) => role.id === item.id && role.scopeId === item.scopeId
            )
        );
        if (newRoles.length) {
          handlers.append(...newRoles);
        }
      }
    } finally {
      setLoad(true);
    }
  }

  useEffect(() => {
    getRoles();
  }, [user]);

  return load && children ? children : <Fragment />;
};

export const canAccessApi = <Request extends ApiRequest>(
  roles: Array<RoleItem>,
  api: Api<Request>,
  apiParams?: Partial<Request>
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

export const useRoles = () => useContext(RolesContext).roles;

export const useCanAccessApi = <Request extends ApiRequest>(
  api?: Api<Request>,
  apiParams?: Partial<Request>
) => {
  return api ? canAccessApi(useRoles(), api, apiParams) : true;
};

export interface IfCanAccessApiProps<Request extends ApiRequest = ApiRequest> {
  api?: Api<Request>;
  apiParams?: Partial<Request>;
  children: React.ReactElement;
}

export const IfCanAccessApi = <Request extends ApiRequest>({
  api,
  apiParams,
  children,
}: IfCanAccessApiProps<Request>) => {
  const allow = useCanAccessApi(api, apiParams);
  return allow ? children : <Fragment />;
};
