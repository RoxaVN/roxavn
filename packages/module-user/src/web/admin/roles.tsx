import { Badge, Group, TextInput } from '@mantine/core';
import { ApiTable, webModule as coreWebModule } from '@roxavn/core/web';
import { IconCrown } from '@tabler/icons';

import { getModuleRolesApi } from '../../share';
import { webModule } from '../module';

const Page = ({ api }: { api: typeof getModuleRolesApi }) => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={api}
      header={t('roles')}
      columns={{
        scope: {
          label: tCore('apps'),
          filterInput: <TextInput placeholder={tCore('apps')} />,
        },
        name: { label: t('roleName') },
        permissions: {
          label: t('permissions'),
          render: (value) => (
            <Group>
              {value.map((v) => (
                <Badge key={v}>{v}</Badge>
              ))}
            </Group>
          ),
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('roles'),
  path: '/roles',
  icon: IconCrown,
  element: <Page api={getModuleRolesApi} />,
});
