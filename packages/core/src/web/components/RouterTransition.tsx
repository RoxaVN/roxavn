import {
  startNavigationProgress,
  completeNavigationProgress,
  NavigationProgress,
  NavigationProgressProps,
} from '@mantine/nprogress';
import { useEffect } from 'react';
import { useTransition } from '@remix-run/react';

export function RouterTransition(props: NavigationProgressProps) {
  const transition = useTransition();

  useEffect(() => {
    // if it's not idle then it's submitting a form and loading the next location loaders
    if (transition.state !== 'idle') {
      startNavigationProgress(); // so you start it
    } else {
      completeNavigationProgress(); // when it's idle again complete it
    }
  }, [transition.state]);

  return <NavigationProgress autoReset={true} {...props} />;
}
