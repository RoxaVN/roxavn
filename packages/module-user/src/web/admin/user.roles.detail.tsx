import { ApiTable, webModule as coreWebModule, utils } from '@roxavn/core/web';
import { useParams } from 'react-router-dom';

import { getUserRolesApi } from '../../share';
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
