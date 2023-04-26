import { SelectProps } from '@mantine/core';
import { ComponentType } from 'react';

import { Api, Collection } from '../../base';
import { Reference } from './reference';
import { utils } from './utils';

export interface RoleItem {
  scope: string;
  scopeId?: string;
  permissions: string[];
  name: string;
  id: number;
}

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

  getUserRolesApi?: Api<
    {
      scope?: string;
      scopeId?: string;
    },
    Collection<RoleItem>
  >;
}

export const userService = new UserService();
