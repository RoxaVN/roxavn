import {
  startNavigationProgress,
  completeNavigationProgress,
  NavigationProgress,
  NavigationProgressProps,
} from '@mantine/nprogress';
import { useEffect } from 'react';
import { useNavigation } from '@remix-run/react';

export function RouterTransition({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: NavigationProgressProps;
}) {
  const navigation = useNavigation();

  useEffect(() => {
    // if it's not idle then it's submitting a form and loading the next location loaders
    if (navigation.state !== 'idle') {
      startNavigationProgress(); // so you start it
    } else {
      completeNavigationProgress(); // when it's idle again complete it
    }
  }, [navigation.state]);

  return (
    <>
      <NavigationProgress autoReset={true} {...options} />
      {children}
    </>
  );
}
