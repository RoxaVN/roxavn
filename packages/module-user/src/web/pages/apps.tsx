import { useState } from 'react';
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
import { IconApps } from '@tabler/icons';
import {
  WebModule,
  webModule as coreWebModule,
  MenuLinks,
  IsAuthenticated,
} from '@roxavn/core/web';

import { webModule as userWebModule } from '../module';
import { UserMenu } from '../components';
import { webRoutes } from '@roxavn/core/base';

const BASE = '/apps';

export default function () {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [webModule, setWebModule] = useState<WebModule>();
  const tCore = coreWebModule.useTranslation().t;
  const { t } = userWebModule.useTranslation();

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
              pageItems={webModule.appPages}
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

            <IsAuthenticated
              userComponent={<UserMenu />}
              guestComponent={
                <Button
                  component={Link}
                  variant="outline"
                  to={webRoutes.Login.generate({ ref: BASE })}
                >
                  {t('login')}
                </Button>
              }
            />
          </Group>
        </Header>
      }
    >
      <Outlet context={{ setWebModule }} />
    </AppShell>
  );
}
