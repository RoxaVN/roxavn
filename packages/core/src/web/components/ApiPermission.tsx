import { useListState, UseListStateHandlers } from '@mantine/hooks';
import React, { Fragment, useContext, useEffect } from 'react';
import { Api, ApiRequest, Collection, Permission } from '../../share';
import { useApi } from '../services';

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

export const useCanAccess = (permission: Permission, scopeId?: string) => {
  const { roles } = useContext(RolesContext);
  return permission.allowedScopes.some(
    (scope) =>
      roles.findIndex(
        (role) =>
          role.scope === scope.type &&
          role.permissions.indexOf(permission.value) > -1 &&
          (scope.hasId ? role.scopeId === scopeId : true)
      ) > -1
  );
};
