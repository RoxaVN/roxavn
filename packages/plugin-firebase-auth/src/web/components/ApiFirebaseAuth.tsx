import firebase from 'firebase/compat/app';
import { useEffect, useState } from 'react';
import { FirebaseAuth, FirebaseAuthProps } from './FirebaseAuth';

export interface ApiFirebaseAuthProps {
  firebaseConfig: {
    appId: string;
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
  uiConfig: FirebaseAuthProps['uiConfig'];
}

export const ApiFirebaseAuth = ({
  firebaseConfig,
  uiConfig,
}: ApiFirebaseAuthProps) => {
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    // Initialize Firebase
    const authApp = firebase.auth(firebase.initializeApp(firebaseConfig));
    authApp.onAuthStateChanged(async (user) => {
      if (user) {
        const accessToken = await user.getIdToken();
        console.log(accessToken);
      }
    });
    setApp(authApp);
  });

  return app && <FirebaseAuth uiConfig={uiConfig} firebaseAuth={app} />;
};
