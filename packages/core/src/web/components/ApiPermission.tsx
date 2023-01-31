import { useListState, UseListStateHandlers } from '@mantine/hooks';
import React, { useContext } from 'react';
import { Api, ApiRequest, Collection, Permission } from '../../share';
import { ApiForm } from './ApiForm';

const RoleContext = React.createContext<{
  roles: Array<RoleItem>;
  handlers: UseListStateHandlers<RoleItem>;
}>({} as any);

export interface RoleItem {
  scope: string;
  scopeId: string;
  permissions: string[];
  name: string;
  id: number;
}

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [roles, handlers] = useListState<RoleItem>([]);
  return (
    <RoleContext.Provider value={{ roles, handlers }}>
      {children}
    </RoleContext.Provider>
  );
};

interface ApiRoleGetterProps<Request extends ApiRequest> {
  children: React.ReactNode;
  api: Api<Request, Collection<RoleItem>>;
  apiParams?: Request;
}

export const ApiRoleGetter = <Request extends ApiRequest>({
  children,
  api,
  apiParams,
}: ApiRoleGetterProps<Request>) => {
  const { roles, handlers } = useContext(RoleContext);
  return (
    <ApiForm
      api={api}
      apiParams={apiParams}
      fetchOnMount
      dataRender={({ data }) => {
        if (data) {
          const newRoles = data.items.filter(
            (item) =>
              !roles.find(
                (role) => role.id === item.id && role.scopeId === item.scopeId
              )
          );
          handlers.append(...newRoles);
          return children;
        }
        return null;
      }}
    />
  );
};

export const useCanAccess = (permission: Permission, scopeId?: string) => {
  const { roles } = useContext(RoleContext);
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
