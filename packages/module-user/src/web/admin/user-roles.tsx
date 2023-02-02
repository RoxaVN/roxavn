import {
  ApiTable,
  ModuleT,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconShieldChevron } from '@tabler/icons';
import { getStatsModuleRoleApi } from '../../share';
import { webModule } from '../module';

webModule.adminPages.push({
  label: (t) => t('userRoles'),
  path: '/user-roles',
  icon: IconShieldChevron,
  render: () => (
    <ApiTable
      api={getStatsModuleRoleApi}
      rowKey="ownerId"
      columns={{
        ownerId: { label: <ModuleT module={coreWebModule} k="ownerId" /> },
        rolesCount: { label: <ModuleT module={webModule} k="roles" /> },
      }}
    />
  ),
});
