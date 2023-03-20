import { userService } from '@roxavn/core/web';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { scopes } from '../../base';

import { webModule } from '../module';

class ErrorBoundary extends React.Component<
  { children: React.ReactElement },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.log(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const Page = () => {
  const id = useParams().id;
  return (
    <ErrorBoundary>
      <Suspense>
        <userService.roleUsers
          scopeId={id}
          module={webModule.name}
          scope={scopes.Project.name}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

webModule.adminPages.push({
  path: '/projects/:id',
  element: <Page />,
});
