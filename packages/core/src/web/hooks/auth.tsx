import React, { useContext, useEffect, useState } from 'react';

import { authService } from '../services/index.js';

export const AuthContext = React.createContext<{
  user?: Record<string, any>;
  loading: boolean;
}>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = authService.authObserver.subscribe((data) => {
      setUser(data);
    });
    const token = authService.getTokenData();
    if (token) {
      authService.authenticate(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => sub.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthContext).user;

export const useAuthData = () => useContext(AuthContext);
