import { ApiTable, webModule as coreWebModule } from '@roxavn/core/web';
import { IconEye, IconShieldChevron } from '@tabler/icons';
import { getStatsModuleRoleApi, getUserRolesApi } from '../../share';
import { webModule } from '../module';

webModule.adminPages.push({
  label: (t) => t('userRoles'),
  path: '/user-roles',
  icon: IconShieldChevron,
  render: () => {
    const { t } = webModule.useTranslation();
    const tCore = coreWebModule.useTranslation().t;

    return (
      <ApiTable
        api={getStatsModuleRoleApi}
        rowKey="ownerId"
        columns={{
          ownerId: { label: tCore('ownerId') },
          rolesCount: { label: t('roles') },
        }}
        cellActions={(item) => [
          {
            label: tCore('detail'),
            icon: IconEye,
            access: { api: getUserRolesApi },
            link: { href: `${item.ownerId}` },
          },
        ]}
      />
    );
  },
});
