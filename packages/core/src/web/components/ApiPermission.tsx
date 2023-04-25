import { useListState, UseListStateHandlers } from '@mantine/hooks';
import React, { Fragment, useContext, useEffect } from 'react';
import { accessManager, Api, ApiRequest, Collection } from '../../base';
import { authService, useApi } from '../services';

export const RolesContext = React.createContext<{
  roles: Array<RoleItem>;
  handlers: UseListStateHandlers<RoleItem>;
}>({} as any);

export interface RoleItem {
  scope: string;
  scopeId?: string;
  permissions: string[];
  name: string;
  id: number;
}

export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const [roles, handlers] = useListState<RoleItem>([]);
  return (
    <RolesContext.Provider value={{ roles, handlers }}>
      {children}
    </RolesContext.Provider>
  );
};

interface ApiRolesGetterProps<Request extends ApiRequest> {
  children: React.ReactElement;
  api: Api<Request, Collection<RoleItem>>;
  apiParams?: Request;
}

export const ApiRolesGetter = <Request extends ApiRequest>({
  children,
  api,
  apiParams,
}: ApiRolesGetterProps<Request>) => {
  const { roles, handlers } = useContext(RolesContext);
  const { data } = useApi(api, apiParams);
  useEffect(() => {
    if (data) {
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
  }, [data]);

  return data ? children : <Fragment />;
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
