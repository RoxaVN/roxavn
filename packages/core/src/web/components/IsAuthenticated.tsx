import { Group, Loader } from '@mantine/core';
import { Navigate, useLocation } from 'react-router-dom';

import { webRoutes } from '../../base/index.js';
import { useAuthData } from '../hooks/index.js';
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
  const { user, isLoading } = useAuthData();

  return isLoading
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
