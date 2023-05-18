import { SelectProps } from '@mantine/core';
import { ComponentType, Fragment, createElement } from 'react';

import { Api, Collection } from '../../base/index.js';
import { Reference } from './reference.js';
import { utils } from './utils.js';
import { RoleItem, useCanAccessApi } from './role.js';

class UserService {
  reference = new Reference();

  @utils.Component.lazy()
  userInput!: ComponentType<Omit<SelectProps, 'data'>>;

  @utils.Component.lazy()
  roleUserInput!: ComponentType<
    Omit<SelectProps, 'data'> & {
      scope: string;
      scopeId: string;
    }
  >;

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
