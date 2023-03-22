import { SelectProps } from '@mantine/core';
import { ComponentType } from 'react';

import { Api } from '../../base';
import { Reference } from './reference';
import { utils } from './utils';

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
}

export const userService = new UserService();
