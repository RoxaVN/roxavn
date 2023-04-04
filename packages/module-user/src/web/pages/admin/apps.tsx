import { useEffect, useState } from 'react';
import { type MetaFunction } from '@remix-run/node';
import { Outlet, Link } from 'react-router-dom';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  Button,
} from '@mantine/core';
import { IconApps } from '@tabler/icons-react';
import {
  CatchBoundary,
  ErrorBoundary,
  WebModule,
  webModule as coreWebModule,
  ApiRolesGetter,
  http,
  TasksProgress,
  MenuLinks,
  IsAuthenticatedPage,
} from '@roxavn/core/web';

import { constants, userRoleApi } from '../../../base';
import { UserMenu } from '../../components';

const BASE = '/admin/apps';

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
  }, []);

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
  return (
    <IsAuthenticatedPage redirect>
      {(user) => (
        <ApiRolesGetter
          api={userRoleApi.modules}
          apiParams={{ userId: user.id }}
        >
          <TasksProgress
            tasks={[{ handler: WebModule.settingsPageRenderRegister }]}
          >
            <AdminComponent />
          </TasksProgress>
        </ApiRolesGetter>
      )}
    </IsAuthenticatedPage>
  );
}

export const meta: MetaFunction = () => ({
  title: 'Web Erp',
});

export { CatchBoundary, ErrorBoundary };
