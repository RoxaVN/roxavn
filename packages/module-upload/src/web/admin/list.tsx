import {
  ApiTable,
  webModule as coreWebModule,
  utils,
  IfCanAccessApi,
} from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons';

import { fileStoageApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={fileStoageApi.getMany}
      rowKey="userId"
      columns={{
        userId: { label: tCore('userId') },
        maxFileSize: { label: t('maxFileSize') },
        currentSize: { label: t('currentStorageSize') },
        maxSize: { label: t('maxStorageSize') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('fileStorages'),
  path: '/',
  icon: IconUsers,
  element: (
    <IfCanAccessApi api={fileStoageApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
