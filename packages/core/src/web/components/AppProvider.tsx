import { MantineProvider, MantineProviderProps } from '@mantine/core';
import { ModalsProvider, ModalsProviderProps } from '@mantine/modals';
import { Notifications, NotificationsProps } from '@mantine/notifications';
import { NavigationProgressProps } from '@mantine/nprogress';
import React, { Fragment } from 'react';
import { Empty } from '../../base/index.js';
import { AuthProvider } from '../hooks/auth.js';
import { RolesProvider } from './ApiPermission.js';
import { RouterTransition } from './RouterTransition.js';

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

export class AppProviderConfigs {
  mantineProvider: {
    options?: Omit<MantineProviderProps, 'children'>;
    component: AppProviderComponent;
  } = {
    component: MantineProvider,
    options: { withGlobalStyles: true, withNormalizeCSS: true },
  };

  navigationProgress: {
    options?: Omit<NavigationProgressProps, 'children'>;
    component: AppProviderComponent;
  } = { component: RouterTransition };

  modalsProvider: {
    options?: Omit<ModalsProviderProps, 'children'>;
    component: AppProviderComponent;
  } = { component: ModalsProvider };

  notificationsProvider: {
    options?: Omit<NotificationsProps, 'children'>;
    component: AppProviderComponent;
  } = { component: NotificationsProvider };

  rolesProvider: {
    options?: Empty;
    component: AppProviderComponent;
  } = { component: RolesProvider };

  authProvider: {
    options?: Empty;
    component: AppProviderComponent;
  } = { component: AuthProvider };
}

export const appProviderConfigs = new AppProviderConfigs();

export const AppProvider = ({ children }: { children: React.ReactElement }) => {
  let element = children;
  Object.values(appProviderConfigs).forEach((item) => {
    element = React.createElement(item.component, {
      ...item.options,
      children: element,
    });
  });
  return element;
};
