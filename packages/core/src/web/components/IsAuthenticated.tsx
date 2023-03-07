import { Loader } from '@mantine/core';
import { useState, useEffect } from 'react';

import { useAuthUser } from '../hooks';
import { authService } from '../services';

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
          } catch {
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
