---
to: src/web/admin/<%= h.changeCase.dot(path_name) %>.tsx
---
import {
  ApiTable,
  IfCanAccessApi,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons';

import { getUsersApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={getUsersApi}
      header={t('test')}
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

webModule.adminPages.push({
  label: (t) => t('test'),
  path: '/test',
  icon: IconUsers,
  element: (
    <IfCanAccessApi api={getUsersApi}>
      <Page />
    </IfCanAccessApi>
  ),
});
