import { useEffect, useState } from 'react';
import { type MetaFunction } from '@remix-run/node';
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
  ApiRolesGetter,
  http,
  TasksProgress,
  MenuLinks,
  IsAuthenticated,
} from '@roxavn/core/web';

import { constants, userRoleApi, WebRoutes } from '../../../base';

const BASE = '/admin/app';

function AdminComponent() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [webModule, setWebModule] = useState<WebModule>();
  const tCore = coreWebModule.useTranslation().t;

  useEffect(() => {
    const subscription = http.preSentObserver.subscribe(({ config }) => {
      Object.assign(config.headers, {
        [constants.AUTH_SCOPE_HTTP_HEADER]: constants.ADMIN_AUTH_SCOPE,
      });
    });

    return () => subscription.unsubscribe();
  });

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
              module={webModule}
              basePath={BASE}
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
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Button
              component={Link}
              to={BASE}
              variant="subtle"
              leftIcon={<IconApps size={20} />}
            >
              {tCore('apps')}
            </Button>
          </div>
        </Header>
      }
    >
      <Outlet context={{ setWebModule }} />
    </AppShell>
  );
}

const AdminPage = () => {
  const location = useLocation();

  return (
    <IsAuthenticated
      loadingComponent={
        <Group position="center" align="center" sx={{ height: '100vh' }}>
          <Loader />
        </Group>
      }
      userComponent={(user) => (
        <ApiRolesGetter
          api={userRoleApi.getAll}
          apiParams={{ userId: user.id }}
        >
          <TasksProgress
            tasks={[{ handler: WebModule.settingsPageRenderRegister }]}
          >
            <AdminComponent />
          </TasksProgress>
        </ApiRolesGetter>
      )}
      guestComponent={
        <Navigate to={WebRoutes.Login.generate({ ref: location.pathname })} />
      }
    />
  );
};

export const meta: MetaFunction = () => ({
  title: 'Web Erp',
});

export default AdminPage;
