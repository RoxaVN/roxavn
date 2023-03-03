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
} from '@mantine/core';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { constants } from '@roxavn/core/base';
import { moduleManager } from '@roxavn/core/server';
import { TabLinks, WebModule } from '@roxavn/core/web';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet } from 'react-router-dom';

import { WebRoutes } from '../../base';
import { IsAuthenticated } from '../components';

const BASE = '/me';

function MeComponent() {
  const { t } = useTranslation(constants.META_I18N_NAMESPACE);
  const data = useLoaderData<typeof loader>();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [webModule, setWebModule] = useState<WebModule>();

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
              label={t(moduleName + '.name')}
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

            <Text>Application header</Text>
          </div>
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
