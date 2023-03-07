import { MantineProvider, MantineProviderProps } from '@mantine/core';
import { ModalsProvider, ModalsProviderProps } from '@mantine/modals';
import { Notifications, NotificationsProps } from '@mantine/notifications';
import { NavigationProgressProps } from '@mantine/nprogress';
import React, { Fragment } from 'react';
import { Empty } from '../../base';
import { AuthProvider } from '../hooks/auth';
import { RolesProvider } from './ApiPermission';
import { RouterTransition } from './RouterTransition';

const NotificationsProvider = ({
  children,
  ...props
}: NotificationsProps & {
  children: React.ReactElement;
}) => (
  <Fragment>
    <Notifications {...props} />
    {children}
  </Fragment>
);

export type AppProviderComponent = React.ComponentType<{
  children: React.ReactElement;
}>;

export const AppProviderConfigs: {
  mantineProvider: {
    options?: Omit<MantineProviderProps, 'children'>;
    component: AppProviderComponent;
  };
  navigationProgress: {
    options?: Omit<NavigationProgressProps, 'children'>;
    component: AppProviderComponent;
  };
  modalsProvider: {
    options?: Omit<ModalsProviderProps, 'children'>;
    component: AppProviderComponent;
  };
  notificationsProvider: {
    options?: Omit<NotificationsProps, 'children'>;
    component: AppProviderComponent;
  };
  rolesProvider: {
    options?: Empty;
    component: AppProviderComponent;
  };
  authProvider: {
    options?: Empty;
    component: AppProviderComponent;
  };
} = {
  mantineProvider: {
    component: MantineProvider,
    options: { withGlobalStyles: true, withNormalizeCSS: true },
  },
  navigationProgress: { component: RouterTransition },
  modalsProvider: { component: ModalsProvider },
  notificationsProvider: { component: NotificationsProvider },
  rolesProvider: { component: RolesProvider },
  authProvider: { component: AuthProvider },
};

export const AppProvider = ({ children }: { children: React.ReactElement }) => {
  let element = children;
  Object.values(AppProviderConfigs).forEach((item) => {
    element = React.createElement(item.component, {
      ...item.options,
      children: element,
    });
  });
  return element;
};
