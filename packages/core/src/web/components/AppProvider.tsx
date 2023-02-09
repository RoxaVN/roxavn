import { MantineProvider, MantineProviderProps } from '@mantine/core';
import { ModalsProvider, ModalsProviderProps } from '@mantine/modals';
import {
  NotificationsProvider,
  NotificationProviderProps,
} from '@mantine/notifications';
import { NavigationProgressProps } from '@mantine/nprogress';
import React from 'react';
import { Empty } from '../../base';
import { RolesProvider } from './ApiPermission';
import { RouterTransition } from './RouterTransition';

export type AppProviderComponent = React.ComponentType<{
  children: React.ReactNode;
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
    options?: Omit<NotificationProviderProps, 'children'>;
    component: AppProviderComponent;
  };
  rolesProvider: {
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
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  let element = children;
  Object.values(AppProviderConfigs)
    .reverse()
    .forEach((item) => {
      element = React.createElement(item.component, {
        ...item.options,
        children: element,
      });
    });
  return element;
};
