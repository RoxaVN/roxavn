import { Group, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { webRoutes } from '../../base/index.js';
import { useAuthUser } from '../hooks/index.js';
import { authService } from '../services/index.js';
import { LoginRequired } from './AppBoundary.js';

export interface IsAuthenticatedProps {
  guestComponent: JSX.Element;
  userComponent: JSX.Element | ((user: Record<string, any>) => JSX.Element);
  loadingComponent?: JSX.Element;
}

export const IsAuthenticated = ({
  guestComponent,
  userComponent,
  loadingComponent,
}: IsAuthenticatedProps): JSX.Element => {
  const user = useAuthUser();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      const token = authService.getTokenData();
      if (token) {
        const timeout = setTimeout(async () => {
          try {
            await authService.authenticate(token);
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setLoading(false);
      }
    }
    return;
  }, []);

  return loading
    ? loadingComponent || <Loader />
    : user
    ? typeof userComponent === 'function'
      ? userComponent(user)
      : userComponent
    : guestComponent;
};

export interface IsAuthenticatedPageProps {
  loader?: JSX.Element;
  redirect?: boolean;
  children: IsAuthenticatedProps['userComponent'];
}

export const IsAuthenticatedPage = ({
  loader,
  children,
  redirect,
}: IsAuthenticatedPageProps) => {
  const location = useLocation();
  return (
    <IsAuthenticated
      loadingComponent={
        loader || (
          <Group position="center" align="center" sx={{ height: '90vh' }}>
            <Loader />
          </Group>
        )
      }
      userComponent={children}
      guestComponent={
        redirect ? (
          <Navigate to={webRoutes.Login.generate({ ref: location.pathname })} />
        ) : (
          <LoginRequired />
        )
      }
    />
  );
};
