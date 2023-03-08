import { useStylesheet } from '@roxavn/core/web';
import { onAuthStateChanged } from 'firebase/auth';
import 'firebase/compat/auth';
import type firebaseuiType from 'firebaseui';
import { useEffect, useRef, useState } from 'react';

export interface FirebaseAuthProps {
  // The Firebase UI Web UI Config object.
  // See: https://github.com/firebase/firebaseui-web#configuration
  uiConfig: firebaseuiType.auth.Config;
  // Callback that will be passed the FirebaseUi instance before it is
  // started. This allows access to certain configuration options such as
  // disableAutoSignIn().
  uiCallback?(ui: firebaseuiType.auth.AuthUI): void;
  // The Firebase App auth instance to use.
  firebaseAuth: any; // As firebaseui-web

  className?: string;
}

export const FirebaseAuth = ({
  uiConfig,
  firebaseAuth,
  className,
  uiCallback,
}: FirebaseAuthProps) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const elementRef = useRef<any>(null);
  const loadedStylesheet = useStylesheet(
    'https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth.css'
  );

  const load = async () => {
    const firebaseui = await import('firebaseui');
    // Get or Create a firebaseUI instance.
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === 'popup') firebaseUiWidget.reset();

    // We track the auth state to reset firebaseUi if the user signs out.
    const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user && userSignedIn) firebaseUiWidget.reset();
      setUserSignedIn(!!user);
    });

    // Trigger the callback if any was set.
    if (uiCallback) uiCallback(firebaseUiWidget);

    // Render the firebaseUi Widget.
    firebaseUiWidget.start(elementRef.current, uiConfig);
    firebaseUiWidget.disableAutoSignIn();

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  };

  useEffect(() => {
    loadedStylesheet && load();
  }, [uiConfig, loadedStylesheet]);

  return <div className={className} ref={elementRef} />;
};
