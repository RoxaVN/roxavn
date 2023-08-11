import React, { useContext, useEffect, useState } from 'react';

import { authService } from '../services/index.js';

export const AuthContext = React.createContext<{
  user?: Record<string, any>;
  isLoading: boolean;
}>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Record<string, any>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sub = authService.authObserver.subscribe((data) => {
      setUser(data);
    });
    const token = authService.getTokenData();
    if (token) {
      authService.authenticate(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    return () => sub.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthContext).user;

export const useAuthData = () => useContext(AuthContext);
