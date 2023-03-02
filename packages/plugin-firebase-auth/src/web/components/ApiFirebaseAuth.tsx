import { Box, LoadingOverlay } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/base';
import { useApi } from '@roxavn/core/web';
import { authProvider } from '@roxavn/module-user/web';
import firebase from 'firebase/compat/app';
import { Fragment, useEffect, useState } from 'react';
import { identityApi } from '../../base';
import { FirebaseAuth, FirebaseAuthProps } from './FirebaseAuth';

export interface ApiFirebaseAuthProps {
  firebaseConfig: {
    appId: string;
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
  uiConfig: FirebaseAuthProps['uiConfig'];
  onSuccess?: (data: InferApiResponse<typeof identityApi.verifyToken>) => void;
}

export const ApiFirebaseAuth = ({
  firebaseConfig,
  uiConfig,
  onSuccess,
}: ApiFirebaseAuthProps) => {
  const [app, setApp] = useState<firebase.auth.Auth>();
  const [token, setToken] = useState<string>();
  const { data, loading } = useApi(
    token ? identityApi.verifyToken : undefined,
    {
      projectId: firebaseConfig.projectId,
      token: token,
    }
  );

  useEffect(() => {
    // Initialize Firebase
    const authApp = firebase.auth(firebase.initializeApp(firebaseConfig));
    authApp.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      }
    });
    setApp(authApp);
  }, []);

  useEffect(() => {
    if (data) {
      authProvider.setTokenData(data);
      app?.signOut();
      onSuccess && onSuccess(data);
    }
  }, [data]);

  return app ? (
    <Box sx={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <FirebaseAuth
        uiConfig={{
          ...uiConfig,
          callbacks: {
            signInSuccessWithAuthResult: function () {
              return false;
            },
          },
        }}
        firebaseAuth={app}
      />
      ;
    </Box>
  ) : (
    <Fragment />
  );
};