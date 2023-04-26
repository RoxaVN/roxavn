import { useListState } from '@mantine/hooks';
import React, { Fragment, useContext, useEffect, useState } from 'react';

import { Api, ApiRequest, Collection } from '../../base';
import {
  apiFetcher,
  authService,
  userService,
  RoleItem,
  RolesContext,
  useCanAccessApi,
} from '../services';
import { useAuthUser } from '../hooks';

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
