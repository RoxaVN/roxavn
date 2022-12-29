import { ApiTable, webModule as coreWebModule, utils } from '@roxavn/core/web';

import { GetUserFilesApi } from '../../../../../share';
import { webModule } from '../../../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={webModule.api(GetUserFilesApi)}
      columns={[
        { key: 'maxFileSize', title: t('maxFileSize') },
        { key: 'currentStorageSize', title: t('currentStorageSize') },
        { key: 'maxStorageSize', title: t('maxStorageSize') },
        {
          key: 'updatedDate',
          title: tCore('updatedDate'),
          render: utils.Render.relativeTime as any,
        },
      ]}
    />
  );
};

export default IndexPage;
