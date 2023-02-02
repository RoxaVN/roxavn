import { TextInput } from '@mantine/core';
import { ApiTable, utils, webModule as coreWebModule } from '@roxavn/core/web';
import { IconCrown } from '@tabler/icons';

import { getModuleRolesApi } from '../../share';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={getModuleRolesApi}
      header={t('roles')}
      columns={{
        scope: {
          label: tCore('apps'),
          filterInput: <TextInput placeholder={tCore('apps')} />,
        },
        name: { label: t('roleName') },
        permissions: {
          label: t('permissions'),
          render: utils.Render.tags,
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('roles'),
  path: '/roles',
  icon: IconCrown,
  render: Page,
});
