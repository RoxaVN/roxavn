import { SelectProps } from '@mantine/core';
import { ComponentType } from 'react';
import { Reference } from './reference';

class UserService {
  reference = new Reference();
  input: ComponentType<Omit<SelectProps, 'data'>> = () => {
    throw new Error('Not implement user input');
  };
}

export const userService = new UserService();
