import { RoleUsers } from '@roxavn/module-user/web';
import { useParams } from 'react-router-dom';
import { scopes } from '../../base';

import { webModule } from '../module';

const Page = () => {
  const id = useParams().id as any;
  return (
    <RoleUsers
      scopeId={id}
      module={webModule.name}
      scope={scopes.Project.name}
    />
  );
};

webModule.adminPages.push({
  path: '/projects/:id',
  element: <Page />,
});
