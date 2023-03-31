import {
  ApiTable,
  authService,
  ModuleT,
  PageItem,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconInbox } from '@tabler/icons-react';
import { projectApi } from '../../base';

import { webModule } from '../module';

const Page = () => {
  const tCore = coreWebModule.useTranslation().t;
  const tokenData = authService.getTokenData();

  return tokenData ? (
    <ApiTable
      api={projectApi.getManyJoined}
      apiParams={{ userId: tokenData.userId }}
      columns={{
        name: { label: tCore('name') },
        type: { label: tCore('type') },
        createdDate: {
          label: tCore('createdDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  ) : (
    <div />
  );
};

export const projectsPage = new PageItem({
  label: <ModuleT module={webModule} k="projects" />,
  path: 'projects',
  icon: IconInbox,
  element: <Page />,
});
