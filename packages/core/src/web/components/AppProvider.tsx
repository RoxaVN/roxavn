import { MantineProvider, MantineProviderProps } from '@mantine/core';
import { ModalsProvider, ModalsProviderProps } from '@mantine/modals';
import {
  NotificationsProvider,
  NotificationProviderProps,
} from '@mantine/notifications';
import { NavigationProgressProps } from '@mantine/nprogress';
import { RolesProvider } from './ApiPermission';
import { RouterTransition } from './RouterTransition';

export const AppConfigs: {
  mantineProvider?: MantineProviderProps;
  navigationProgress?: NavigationProgressProps;
  modalsProvider?: ModalsProviderProps;
  notificationsProvider?: NotificationProviderProps;
} = {};

export const AppProvider = ({ children }: { children: React.ReactElement }) => (
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    {...AppConfigs.mantineProvider}
  >
    <ModalsProvider {...AppConfigs.modalsProvider}>
      <RouterTransition {...AppConfigs.navigationProgress} />
      <NotificationsProvider {...AppConfigs.notificationsProvider}>
        <RolesProvider>{children}</RolesProvider>
      </NotificationsProvider>
    </ModalsProvider>
  </MantineProvider>
);
