import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Loader,
  Group,
  NavLink,
  Avatar,
  Box,
  Menu,
} from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { constants } from '@roxavn/core/base';
import { moduleManager } from '@roxavn/core/server';
import {
  authService,
  IsAuthenticated,
  TabLinks,
  useAuthUser,
  WebModule,
} from '@roxavn/core/web';
import { IconLogout, IconUserCircle } from '@tabler/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet } from 'react-router-dom';

import { WebRoutes } from '../../base';
import { webModule as userWebModule } from '../module';
import { userReference } from '../references';

const BASE = '/me';

function MeComponent() {
  const tMeta = useTranslation(constants.META_I18N_NAMESPACE).t;
  const { t } = userWebModule.useTranslation();
  const data = useLoaderData<typeof loader>();
  const authUser = useAuthUser();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [webModule, setWebModule] = useState<WebModule>();
  const { renderItem } = userReference.use({ ids: [authUser?.id] });

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
          {data.modules.map((moduleName) => (
            <NavLink
              key={moduleName}
              label={tMeta(moduleName + '.name')}
              icon={
                <Avatar
                  radius="sm"
                  src={WebModule.resolveStaticPath(moduleName, '/icon.svg')}
                />
              }
              active={location.pathname.startsWith(
                BASE + '/' + WebModule.escapeName(moduleName)
              )}
              component={Link}
              to={WebModule.escapeName(moduleName)}
            />
          ))}
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 60 }} p="md">
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
            <Group position="apart" align="center">
              <Text>Application header</Text>
              <Menu width={200} trigger="hover">
                <Menu.Target>
                  <span>{renderItem(authUser?.id)}</span>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconUserCircle size={14} />}
                    component={Link}
                    to="/me"
                  >
                    {t('myProfile')}
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    component="button"
                    onClick={() => {
                      const token = authService.getTokenData();
                      token && authService.logout(token);
                    }}
                  >
                    {t('logout')}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </MediaQuery>
        </Header>
      }
    >
      {webModule && (
        <Box mb="md">
          <TabLinks
            pageItems={webModule.mePages}
            module={webModule}
            basePath={BASE}
          />
        </Box>
      )}
      <Outlet context={{ setWebModule }} />
    </AppShell>
  );
}

const MePage = () => (
  <IsAuthenticated
    loadingComponent={
      <Group position="center" align="center" sx={{ height: '100vh' }}>
        <Loader />
      </Group>
    }
    userComponent={<MeComponent />}
    guestComponent={<Navigate to={WebRoutes.Login.path} />}
  />
);
export async function loader() {
  return json({
    modules: moduleManager.getModulesHaveMePages(),
  });
}

export default MePage;
