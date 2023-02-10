import {
  ApiTable,
  webModule as coreWebModule,
  utils,
  ApiFormGroup,
  ApiConfirmFormGroup,
  IfCanAccessApi,
} from '@roxavn/core/web';
import { IconPlus, IconTrash } from '@tabler/icons';
import { useParams } from 'react-router-dom';

import { getUserRolesApi, addUserRoleApi, deleteUserRoleApi } from '../../base';
import { ModuleRoleInput } from '../components';
import { webModule } from '../module';

const Page = () => {
  const id = parseInt(useParams().id as any);
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return id ? (
    <ApiTable
      api={getUserRolesApi}
      apiParams={{ id }}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          modal: {
            title: t('addRole'),
            children: (
              <ApiFormGroup
                api={addUserRoleApi}
                apiParams={{ id }}
                fields={[
                  {
                    name: 'roleId',
                    input: <ModuleRoleInput label={t('role')} />,
                  },
                ]}
              />
            ),
          },
        },
      ]}
      columns={{
        resource: {
          label: tCore('apps'),
        },
        name: { label: t('roleName') },
        permissions: {
          label: t('permissions'),
          render: utils.Render.tags,
        },
      }}
      cellActions={(item) => [
        {
          label: tCore('delete'),
          icon: IconTrash,
          modal: (closeModal) => ({
            title: t('deleteUserRole', { role: item.name }),
            children: (
              <ApiConfirmFormGroup
                api={deleteUserRoleApi}
                onCancel={closeModal}
                apiParams={{ id: id, roleId: item.id }}
              />
            ),
          }),
        },
      ]}
    />
  ) : (
    <div />
  );
};

webModule.adminPages.push({
  path: '/user-roles/:id',
  element: (
    <IfCanAccessApi api={getUserRolesApi}>
      <Page />
    </IfCanAccessApi>
  ),
});
