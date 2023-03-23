import {
  AppShell,
  Burger,
  Footer,
  Group,
  Header,
  Loader,
  MediaQuery,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IsAuthenticated } from '@roxavn/core/web';
import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { WebRoutes } from '../../base';

import { UserMenu } from '../components';

function AppComponent() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={{ base: 60 }} p="md">
          <Group position="apart" align="center">
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
              <Text>Application header</Text>
            </MediaQuery>
            <UserMenu />
          </Group>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}

export default function () {
  const location = useLocation();
  return (
    <IsAuthenticated
      loadingComponent={
        <Group position="center" align="center" sx={{ height: '100vh' }}>
          <Loader />
        </Group>
      }
      userComponent={<AppComponent />}
      guestComponent={
        <Navigate to={WebRoutes.Login.generate({ ref: location.pathname })} />
      }
    />
  );
}
