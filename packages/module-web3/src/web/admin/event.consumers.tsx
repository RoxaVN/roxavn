import {
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconPacman } from '@tabler/icons-react';

import { web3EventConsumerApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={web3EventConsumerApi.getMany}
      header={t('eventConsumers')}
      columns={{
        name: { label: tCore('name') },
        crawlerId: { label: t('crawler') },
        lastConsumeBlockNumber: { label: t('lastBlockNumber') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

export const eventConsumersPage = new PageItem({
  label: <ModuleT module={webModule} k="eventConsumers" />,
  path: 'event-consumers',
  icon: IconPacman,
  element: (
    <IfCanAccessApi api={web3EventConsumerApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
