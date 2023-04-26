import { SelectProps } from '@mantine/core';
import { ComponentType, Fragment, createElement } from 'react';

import { Api, Collection } from '../../base';
import { Reference } from './reference';
import { utils } from './utils';
import { RoleItem, useCanAccessApi } from './role';

class UserService {
  reference = new Reference();

  @utils.Component.lazy()
  input!: ComponentType<Omit<SelectProps, 'data'>>;

  @utils.Component.lazy()
  roleUsers!: ComponentType<{
    module?: string;
    scope?: string;
    scopeId?: string;
  }>;

  roleUsersAccessApi?: Api<{
    scope?: string;
    scopeId?: string;
    module?: string;
  }>;

  roleUsersGuard({
    children,
    ...props
  }: {
    scope?: string;
    scopeId?: string;
    module?: string;
    children: React.ReactElement;
  }) {
    return useCanAccessApi(userService.roleUsersAccessApi, props)
      ? children
      : createElement(Fragment);
  }

  getUserRolesApi?: Api<
    {
      scope?: string;
      scopeId?: string;
    },
    Collection<RoleItem>
  >;
}

export const userService = new UserService();
