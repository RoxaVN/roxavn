import {
  ApiTable,
  webModule as coreWebModule,
  utils,
  ApiFormGroup,
} from '@roxavn/core/web';
import { IconPlus } from '@tabler/icons';
import { useParams } from 'react-router-dom';

import { getUserRolesApi, addUserRoleApi } from '../../share';
import { ModuleRoleInput } from '../components';
import { webModule } from '../module';

webModule.adminPages.push({
  path: '/user-roles/:id',
  render: () => {
    const id = parseInt(useParams().id as any);
    const { t } = webModule.useTranslation();
    const tCore = coreWebModule.useTranslation().t;
    return id ? (
      <ApiTable
        api={getUserRolesApi}
        apiParams={{ id }}
        headerActions={({ fetch }) => [
          {
            label: tCore('add'),
            icon: IconPlus,
            dialog: {
              title: t('addRole'),
              content: (
                <ApiFormGroup
                  api={addUserRoleApi}
                  apiParams={{ id }}
                  onSuccess={() => fetch({ id })}
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
          scope: {
            label: tCore('apps'),
          },
          name: { label: t('roleName') },
          permissions: {
            label: t('permissions'),
            render: utils.Render.tags,
          },
        }}
      />
    ) : (
      <div />
    );
  },
});
