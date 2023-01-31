import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type MetaFunction } from '@remix-run/node';
import {
  Navigate,
  Outlet,
  useLocation,
  resolvePath,
  matchPath,
  Link,
} from 'react-router-dom';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  MediaQuery,
  Burger,
  useMantineTheme,
  NavLink,
  Group,
  Loader,
  Button,
} from '@mantine/core';
import { IconChevronRight, IconApps } from '@tabler/icons';
import {
  PageItem,
  WebModule,
  webModule as coreWebModule,
} from '@roxavn/core/web';

import { IsAuthenticated } from '../../components';
import { WebRoutes } from '../../../share';

const BASE = '/admin/app';

function AdminComponent() {
  const location = useLocation();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [webModule, setWebModule] = useState<WebModule>();
  const { t } = useTranslation(webModule && webModule.escapedName);
  const tCore = coreWebModule.useTranslation().t;

  const renderMenuItems = (_pageItems: PageItem[], module: WebModule) =>
    _pageItems.map((pageItem, index) => {
      const props: any = {
        key: index + 1,
        label:
          typeof pageItem.label === 'function'
            ? pageItem.label(t)
            : pageItem.label,
        description: pageItem.description,
        icon: pageItem.icon && <pageItem.icon size={16} stroke={1.5} />,
      };
      if (pageItem.children) {
        props.rightSection = <IconChevronRight size={14} stroke={1.5} />;
      } else if (typeof pageItem.path === 'string') {
        if (pageItem.path.startsWith('/')) {
          const path = resolvePath(module.escapedName + pageItem.path, BASE);
          if (matchPath(path.pathname, location.pathname)) {
            props.variant = 'filled';
            props.active = true;
          } else {
            props.component = Link;
            props.to = path;
          }
        } else {
          throw Error(
            'Path must start with / in menu ' + JSON.stringify(pageItem)
          );
        }
      } else {
        throw Error(
          'Must define path or children in menu ' + JSON.stringify(pageItem)
        );
      }
      return <NavLink {...props} />;
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
          {webModule && renderMenuItems(webModule.adminPages, webModule)}
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

const AdminPage = () => (
  <IsAuthenticated
    loadingComponent={
      <Group position="center" align="center" sx={{ height: '100vh' }}>
        <Loader />
      </Group>
    }
    userComponent={<AdminComponent />}
    guestComponent={<Navigate to={WebRoutes.Login.path} />}
  />
);

export const meta: MetaFunction = () => ({
  title: 'Web Erp',
});

export default AdminPage;
