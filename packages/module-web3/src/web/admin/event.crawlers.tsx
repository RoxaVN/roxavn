import {
  ApiFormGroup,
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconEdit, IconPlus, IconSpider } from '@tabler/icons-react';

import { web3EventCrawlerApi } from '../../base/index.js';
import { webModule } from '../module.js';
import { Checkbox, NumberInput, TextInput } from '@mantine/core';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={web3EventCrawlerApi.getMany}
      header={t('eventCrawlers')}
      columns={{
        contractId: { label: t('contract') },
        event: { label: t('event') },
        isActive: { label: tCore('status') },
        blockRangePerCrawl: { label: t('blockRangePerCrawl') },
        delayBlockCount: { label: t('delayBlockCount') },
        lastCrawlBlockNumber: { label: t('lastCrawlBlockNumber') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          modal: {
            title: t('addEventCrawler'),
            children: (
              <ApiFormGroup
                api={web3EventCrawlerApi.create}
                fields={[
                  {
                    name: 'contractId',
                    input: <NumberInput label={t('contract')} />,
                  },
                  {
                    name: 'event',
                    input: <TextInput label={t('event')} />,
                  },
                  {
                    name: 'lastCrawlBlockNumber',
                    input: <NumberInput label={t('lastCrawlBlockNumber')} />,
                  },
                ]}
              />
            ),
          },
        },
      ]}
      cellActions={(item) => [
        {
          label: tCore('edit'),
          icon: IconEdit,
          modal: {
            title: t('editEventCrawler'),
            children: (
              <ApiFormGroup
                api={web3EventCrawlerApi.update}
                apiParams={{
                  web3EventCrawlerId: item.id,
                  blockRangePerCrawl: item.blockRangePerCrawl,
                  delayBlockCount: item.delayBlockCount,
                  isActive: item.isActive,
                }}
                fields={[
                  {
                    name: 'blockRangePerCrawl',
                    input: <NumberInput label={t('blockRangePerCrawl')} />,
                  },
                  {
                    name: 'delayBlockCount',
                    input: <NumberInput label={t('delayBlockCount')} />,
                  },
                  {
                    name: 'isActive',
                    input: <Checkbox label={tCore('status')} />,
                  },
                ]}
              />
            ),
          },
        },
      ]}
    />
  );
};

export const eventCrawlersPage = new PageItem({
  label: <ModuleT module={webModule} k="eventCrawlers" />,
  path: 'event-crawlers',
  icon: IconSpider,
  element: (
    <IfCanAccessApi api={web3EventCrawlerApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
