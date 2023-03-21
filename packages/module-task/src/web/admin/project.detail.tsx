import { PageItem, userService } from '@roxavn/core/web';
import { useParams } from 'react-router-dom';
import { scopes } from '../../base';

import { webModule } from '../module';

const Page = () => {
  const id = useParams().id;
  return (
    <userService.roleUsers
      scopeId={id}
      module={webModule.name}
      scope={scopes.Project.name}
    />
  );
};

export const projectRolesPage = new PageItem({
  path: '/projects/:id',
  element: <Page />,
});
