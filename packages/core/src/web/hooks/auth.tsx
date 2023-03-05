import React, { useContext, useEffect, useState } from 'react';

import { authService } from '../services';

export const AuthContext = React.createContext<{
  user?: Record<string, any>;
}>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Record<string, any>>();

  useEffect(() => {
    const sub = authService.authObserver.subscribe((data) => {
      setUser(data);
    });

    return () => sub.unsubscribe();
  });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthContext).user;
