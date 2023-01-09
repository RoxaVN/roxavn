import { ApiTable, webModule as coreWebModule, utils } from '@roxavn/core/web';

import { GetUserFilesApi } from '../../../../../share';
import { webModule } from '../../../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={webModule.api(GetUserFilesApi)}
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

export default IndexPage;
