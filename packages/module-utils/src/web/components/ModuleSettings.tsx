import { Text, Card, SimpleGrid } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { InferApiRequest } from '@roxavn/core/base';
import { ApiForm, webModule as coreWebModule } from '@roxavn/core/web';
import { IconCheck } from '@tabler/icons-react';
import React from 'react';

import { settingApi } from '../../base/index.js';

export interface ModuleSettingsProps {
  api: typeof settingApi.getAll;
  apiParams: InferApiRequest<typeof settingApi.getAll>;
  forms: {
    [name: string]: {
      title: React.ReactNode;
      description?: React.ReactNode;
      form: React.ReactElement;
    };
  };
}

export const ModuleSettings = ({
  api,
  apiParams,
  forms,
}: ModuleSettingsProps) => {
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiForm
      fetchOnMount
      api={api}
      apiParams={apiParams}
      dataRender={({ data }) =>
        data && (
          <SimpleGrid
            cols={3}
            breakpoints={[
              { maxWidth: 'lg', cols: 2, spacing: 'md' },
              { maxWidth: 'sm', cols: 1, spacing: 'sm' },
            ]}
          >
            {Object.entries(forms).map(([name, item]) => {
              const itemValue = data.items.find((i) => i.name === name);
              return (
                <Card
                  withBorder
                  key={name}
                  sx={
                    itemValue?.type === 'public'
                      ? { borderTopColor: 'green', borderTopWidth: 3 }
                      : {}
                  }
                >
                  <Text weight={500} mb="xs">
                    {item.title}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {item.description}
                  </Text>
                  {React.cloneElement(item.form, {
                    apiParams: itemValue?.metadata,
                    onSuccess: (...args: any) => {
                      showNotification({
                        autoClose: 10000,
                        title: item.title,
                        message: tCore('success'),
                        color: 'green',
                        icon: <IconCheck />,
                      });
                      item.form.props.onSuccess?.apply(item.form, args);
                    },
                  })}
                </Card>
              );
            })}
          </SimpleGrid>
        )
      }
    />
  );
};
