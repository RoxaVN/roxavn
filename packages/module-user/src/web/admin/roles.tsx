import { TextInput } from '@mantine/core';
import {
  ApiTable,
  IfCanAccessApi,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconCrown } from '@tabler/icons';

import { getModuleRolesApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={getModuleRolesApi}
      header={t('roles')}
      filters={[
        { name: 'resource', input: <TextInput label={tCore('apps')} /> },
      ]}
      columns={{
        resource: { label: tCore('apps') },
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
  element: (
    <IfCanAccessApi api={getModuleRolesApi}>
      <Page />
    </IfCanAccessApi>
  ),
});
