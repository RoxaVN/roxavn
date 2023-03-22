import {
  ApiTable,
  webModule as coreWebModule,
  utils,
  ApiFormGroup,
  ApiConfirmFormGroup,
  IfCanAccessApi,
  userService,
  PageItem,
} from '@roxavn/core/web';
import { IconPlus, IconTrash } from '@tabler/icons';
import { useParams } from 'react-router-dom';

import { userRoleApi } from '../../base';
import { RoleInput } from '../components';
import { webModule } from '../module';

const Page = () => {
  const id = useParams().id as any;
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  const { renderItem } = userService.reference.use({ ids: id });

  return id ? (
    <ApiTable
      api={userRoleApi.getAll}
      apiParams={{ userId: id }}
      header={renderItem(id)}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          modal: {
            title: t('addRole'),
            children: (
              <ApiFormGroup
                api={userRoleApi.create}
                apiParams={{ userId: id }}
                fields={[
                  {
                    name: 'roleId',
                    input: <RoleInput label={t('role')} />,
                  },
                ]}
              />
            ),
          },
        },
      ]}
      columns={{
        scope: {
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
                api={userRoleApi.delete}
                onCancel={closeModal}
                apiParams={{ userId: id, roleId: item.id }}
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

export const userRolesDetailPage = new PageItem({
  path: 'user-roles/:id',
  element: (
    <IfCanAccessApi api={userRoleApi.getAll}>
      <Page />
    </IfCanAccessApi>
  ),
});
