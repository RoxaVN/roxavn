import { Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { auth } from '../services';

export interface IsAuthenticatedProps {
  guestComponent: JSX.Element;
  userComponent: JSX.Element;
  loadingComponent?: JSX.Element;
}

export const IsAuthenticated = ({
  guestComponent,
  userComponent,
  loadingComponent,
}: IsAuthenticatedProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      setUser(auth.getUser());
      setLoading(false);
    } else {
      const token = auth.getToken();
      if (token) {
        const timeout = setTimeout(() => {
          auth
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
    ? userComponent
    : guestComponent;
};
