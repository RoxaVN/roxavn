import {
  Button,
  Container,
  createStyles,
  Group,
  rem,
  Text,
  Title,
} from '@mantine/core';
import { useCatch, Link, useLocation } from '@remix-run/react';

import { webRoutes } from '../../base/index.js';
import { webModule } from '../services/index.js';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export const CatchBoundary = () => {
  const caught = useCatch();
  const location = useLocation();
  const { classes } = useStyles();
  const { t } = webModule.useTranslation();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>{caught.status}</div>
      <Title className={classes.title}>{t('errorTitle')}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {t('RouteError.' + caught.status)}
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          component={Link}
          to={
            caught.status === 401
              ? webRoutes.Login.generate({ ref: location.pathname })
              : webRoutes.Home.path
          }
        >
          {t(caught.status === 401 ? 'goToLoginPage' : 'backToHomePage')}
        </Button>
      </Group>
    </Container>
  );
};

export function ErrorBoundary({ error }: { error: Error }) {
  const { classes } = useStyles();
  const { t } = webModule.useTranslation();
  return (
    <Container className={classes.root}>
      <div className={classes.label}>{t('error')}</div>
      <Title className={classes.title}>{t('errorTitle')}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {error.message}
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          component={Link}
          to={webRoutes.Home.path}
        >
          {t('backToHomePage')}
        </Button>
      </Group>
    </Container>
  );
}

export const LoginRequired = () => {
  const { classes } = useStyles();
  const location = useLocation();
  const { t } = webModule.useTranslation();
  return (
    <Container className={classes.root}>
      <div className={classes.label}>403</div>
      <Title className={classes.title}>{t('loginRequired')}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {t('RouteError.403')}
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          component={Link}
          to={webRoutes.Login.generate({ ref: location.pathname })}
        >
          {t('goToLoginPage')}
        </Button>
      </Group>
    </Container>
  );
};
