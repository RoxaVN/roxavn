import { TextInput } from '@mantine/core';
import {
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconCrown } from '@tabler/icons-react';
import kebabCase from 'lodash/kebabCase';

import { roleApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={roleApi.getMany}
      header={t('roles')}
      filters={[
        { name: 'scopeText', input: <TextInput label={tCore('apps')} /> },
      ]}
      columns={{
        scope: { label: tCore('apps') },
        name: { label: t('roleName') },
        permissions: {
          label: t('permissions'),
          render: (permissions) =>
            utils.Render.tags(permissions.map(kebabCase)),
        },
      }}
    />
  );
};

export const rolesPage = new PageItem({
  label: <ModuleT module={webModule} k="roles" />,
  path: 'roles',
  icon: IconCrown,
  element: (
    <IfCanAccessApi api={roleApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
