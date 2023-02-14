import { Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { AuthData, authProvider } from '../services';

export interface IsAuthenticatedProps {
  guestComponent: JSX.Element;
  userComponent: JSX.Element | ((user: AuthData) => JSX.Element);
  loadingComponent?: JSX.Element;
}

export const IsAuthenticated = ({
  guestComponent,
  userComponent,
  loadingComponent,
}: IsAuthenticatedProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthData>();

  useEffect(() => {
    if (authProvider.isAuthenticated()) {
      setUser(authProvider.getUser());
      setLoading(false);
    } else {
      const token = authProvider.getTokenData();
      if (token) {
        const timeout = setTimeout(() => {
          authProvider
            .authenticate(token)
            .then((user) => {
              setUser(user);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
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
