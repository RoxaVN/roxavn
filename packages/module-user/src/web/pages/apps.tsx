import { useState } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  Loader,
  Button,
} from '@mantine/core';
import { IconApps } from '@tabler/icons';
import {
  WebModule,
  webModule as coreWebModule,
  MenuLinks,
  IsAuthenticated,
} from '@roxavn/core/web';

import { WebRoutes } from '../../base';
import { UserMenu } from '../components';

const BASE = '/apps';

function AppsComponent() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [webModule, setWebModule] = useState<WebModule>();
  const tCore = coreWebModule.useTranslation().t;

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
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          {webModule && (
            <MenuLinks
              pageItems={webModule.adminPages}
              basePath={BASE + '/' + webModule.escapedName}
            />
          )}
        </Navbar>
      }
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
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Button
                component={Link}
                to={BASE}
                variant="subtle"
                leftIcon={<IconApps size={20} />}
              >
                {tCore('apps')}
              </Button>
            </MediaQuery>

            <UserMenu />
          </Group>
        </Header>
      }
    >
      <Outlet context={{ setWebModule }} />
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
      userComponent={<AppsComponent />}
      guestComponent={
        <Navigate to={WebRoutes.Login.generate({ ref: location.pathname })} />
      }
    />
  );
}
