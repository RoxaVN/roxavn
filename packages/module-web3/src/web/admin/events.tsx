import {
  ApiTable,
  IfCanAccessApi,
  JSONTree,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconArticle } from '@tabler/icons-react';

import { web3EventApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={web3EventApi.getMany}
      header={t('events')}
      columns={{
        id: { label: tCore('id') },
        contractAddress: { label: t('contract') },
        event: { label: t('event') },
        networkId: { label: t('networkId') },
        blockNumber: { label: t('block') },
        data: {
          label: tCore('data'),
          render: (value) => <JSONTree data={value} />,
        },
        createdDate: {
          label: tCore('createdDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

export const eventsPage = new PageItem({
  label: <ModuleT module={webModule} k="events" />,
  path: 'events',
  icon: IconArticle,
  element: (
    <IfCanAccessApi api={web3EventApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
