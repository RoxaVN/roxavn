import { NumberInput, TextInput } from '@mantine/core';
import {
  ApiFormGroup,
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  ObjectInput,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconEdit, IconFileCode, IconPlus } from '@tabler/icons-react';

import { web3ContractApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={web3ContractApi.getMany}
      header={t('contracts')}
      columns={{
        id: { label: tCore('id') },
        address: { label: t('address') },
        networkId: { label: t('networkId') },
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
            title: t('addContract'),
            children: (
              <ApiFormGroup
                api={web3ContractApi.create}
                fields={[
                  {
                    name: 'networkId',
                    input: <NumberInput label={t('networkId')} />,
                  },
                  {
                    name: 'address',
                    input: <TextInput label={t('address')} />,
                  },
                  {
                    name: 'abi',
                    input: <ObjectInput label={t('contractAbi')} />,
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
            title: t('editContract'),
            children: (
              <ApiFormGroup
                api={web3ContractApi.update}
                apiParams={{
                  web3ContractId: item.id,
                  abi: item.abi,
                  address: item.address,
                  networkId: parseInt(item.networkId),
                }}
                fields={[
                  {
                    name: 'networkId',
                    input: <NumberInput label={t('networkId')} />,
                  },
                  {
                    name: 'address',
                    input: <TextInput label={t('address')} />,
                  },
                  {
                    name: 'abi',
                    input: <ObjectInput label={t('contractAbi')} />,
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

export const contractsPage = new PageItem({
  label: <ModuleT module={webModule} k="contracts" />,
  path: 'contracts',
  icon: IconFileCode,
  element: (
    <IfCanAccessApi api={web3ContractApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
