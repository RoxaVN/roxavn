import {
  ApiTable,
  webModule as coreWebModule,
  utils,
  IfCanAccessApi,
} from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons';

import { getUserFilesApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={getUserFilesApi}
      rowKey="ownerId"
      columns={{
        ownerId: { label: tCore('ownerId') },
        maxFileSize: { label: t('maxFileSize') },
        currentStorageSize: { label: t('currentStorageSize') },
        maxStorageSize: { label: t('maxStorageSize') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('userFiles'),
  path: '/',
  icon: IconUsers,
  element: (
    <IfCanAccessApi api={getUserFilesApi}>
      <Page />
    </IfCanAccessApi>
  ),
});
