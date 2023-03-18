import { SelectProps } from '@mantine/core';
import { ComponentType } from 'react';
import { Reference } from './reference';

class UserService {
  reference = new Reference();
  input: ComponentType<Omit<SelectProps, 'data'>> = () => {
    throw new Error('Not implement user input');
  };
  roleUsers: ComponentType<{
    module?: string;
    scope?: string;
    scopeId?: string;
  }> = () => {
    throw new Error('Not implement RoleUsers component');
  };
}

export const userService = new UserService();
