import { ApiTable, webModule as coreWebModule, utils } from '@roxavn/core/web';

import { GetUserFilesApi } from '../../../../../share';
import { webModule } from '../../../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={webModule.api(GetUserFilesApi)}
      columns={{
        maxFileSize: { title: t('maxFileSize') },
        currentStorageSize: { title: t('currentStorageSize') },
        maxStorageSize: { title: t('maxStorageSize') },
        updatedDate: {
          title: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

export default IndexPage;
