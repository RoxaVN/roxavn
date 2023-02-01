---
to: src/web/admin/<%= h.changeCase.dot(path_name) %>.tsx
---
import { TextInput } from '@mantine/core';
import { ApiTable, webModule as coreWebModule, utils } from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons';

import { getUsersApi } from '../../share';
import { webModule } from '../module';

const Page = ({ api }: { api: typeof getUsersApi }) => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={api}
      header={t('<%= h.changeCase.camel(path_name) %>')}
      columns={{
        username: {
          label: t('username'),
          filterInput: <TextInput placeholder={t('username')} />,
        },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('<%= h.changeCase.camel(path_name) %>'),
  path: '/<%= h.changeCase.param(path_name) %>',
  icon: IconUsers,
  element: <Page api={getUsersApi} />,
});
