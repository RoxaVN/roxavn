import { NumberInput, TextInput } from '@mantine/core';
import {
  ApiFormGroup,
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconEdit, IconPlus, IconTopologyRing3 } from '@tabler/icons-react';

import { web3ProviderApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={web3ProviderApi.getMany}
      header={t('providers')}
      columns={{
        id: { label: tCore('id') },
        networkId: { label: t('networkId') },
        url: { label: tCore('url') },
        blockRangePerCrawl: { label: t('blockRangePerCrawl') },
        delayBlockCount: { label: t('delayBlockCount') },
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
            title: t('addNetwork'),
            children: (
              <ApiFormGroup
                api={web3ProviderApi.create}
                fields={[
                  {
                    name: 'networkId',
                    input: <NumberInput label={t('networkId')} />,
                  },
                  {
                    name: 'url',
                    input: <TextInput label={tCore('url')} />,
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
            title: t('editNetwork', { id: item.id }),
            children: (
              <ApiFormGroup
                api={web3ProviderApi.update}
                apiParams={{
                  web3ProviderId: item.id,
                  url: item.url,
                  networkId: parseInt(item.networkId),
                  blockRangePerCrawl: item.blockRangePerCrawl,
                  delayBlockCount: item.delayBlockCount,
                }}
                fields={[
                  {
                    name: 'networkId',
                    input: <NumberInput label={t('networkId')} />,
                  },
                  {
                    name: 'url',
                    input: <TextInput label={tCore('url')} />,
                  },
                  {
                    name: 'blockRangePerCrawl',
                    input: <NumberInput label={t('blockRangePerCrawl')} />,
                  },
                  {
                    name: 'delayBlockCount',
                    input: <NumberInput label={t('delayBlockCount')} />,
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

export const providersPage = new PageItem({
  label: <ModuleT module={webModule} k="providers" />,
  path: 'providers',
  icon: IconTopologyRing3,
  element: (
    <IfCanAccessApi api={web3ProviderApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
