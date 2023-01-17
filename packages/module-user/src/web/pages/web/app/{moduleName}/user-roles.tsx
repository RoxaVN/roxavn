import { ApiTable, webModule as coreWebModule } from '@roxavn/core/web';
import { getStatsModuleRoleApi } from '../../../../../share';
import { webModule } from '../../../../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  return (
    <ApiTable
      api={getStatsModuleRoleApi}
      columns={{
        ownerId: { label: tCore('ownerId') },
        rolesCount: { label: t('roles') },
      }}
    />
  );
};

export default Page;
