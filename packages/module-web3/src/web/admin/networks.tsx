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

import { web3NetworkApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={web3NetworkApi.getMany}
      header={t('networks')}
      columns={{
        id: { label: tCore('id') },
        providerUrl: { label: t('providerUrl') },
        explorerUrl: { label: t('explorerUrl') },
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
                api={web3NetworkApi.create}
                fields={[
                  { name: 'id', input: <NumberInput label={tCore('id')} /> },
                  {
                    name: 'providerUrl',
                    input: <TextInput label={t('providerUrl')} />,
                  },
                  {
                    name: 'explorerUrl',
                    input: <TextInput label={t('explorerUrl')} />,
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
                api={web3NetworkApi.update}
                apiParams={{
                  web3NetworkId: item.id,
                  providerUrl: item.providerUrl,
                  explorerUrl: item.explorerUrl,
                }}
                fields={[
                  {
                    name: 'providerUrl',
                    input: <TextInput label={t('providerUrl')} />,
                  },
                  {
                    name: 'explorerUrl',
                    input: <TextInput label={t('explorerUrl')} />,
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

export const networksPage = new PageItem({
  label: <ModuleT module={webModule} k="networks" />,
  path: 'networks',
  icon: IconTopologyRing3,
  element: (
    <IfCanAccessApi api={web3NetworkApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});