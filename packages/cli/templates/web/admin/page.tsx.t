---
to: src/web/admin/<%= h.changeCase.dot(path_name) %>.tsx
---
import {
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons-react';

import { getUsersApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={getUsersApi}
      header={t('<%= h.changeCase.camel(path_name) %>')}
      columns={{
        username: { label: t('username') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

export const <%= h.changeCase.camel(path_name) %>Page = new PageItem({
  label: <ModuleT module={webModule} k="<%= h.changeCase.camel(path_name) %>" />,
  path: '<%= h.changeCase.param(path_name) %>',
  icon: IconUsers,
  element: (
    <IfCanAccessApi api={getUsersApi}>
      <Page />
    </IfCanAccessApi>
  ),
});
