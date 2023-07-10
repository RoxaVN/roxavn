import {
  ApiTable,
  webModule as coreWebModule,
  utils,
  IfCanAccessApi,
  PageItem,
  ModuleT,
} from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons-react';

import { fileStorageApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={fileStorageApi.getMany}
      itemKey="userId"
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

export const fileStoragesPage = new PageItem({
  label: <ModuleT module={webModule} k="fileStorages" />,
  path: '',
  icon: IconUsers,
  element: (
    <IfCanAccessApi api={fileStorageApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
