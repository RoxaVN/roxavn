import { Text, Card, Grid } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Api } from '@roxavn/core/share';
import { ApiForm, webModule as coreWebModule } from '@roxavn/core/web';
import { IconCheck } from '@tabler/icons';
import React from 'react';

import { GetModuleSettingResponse } from '../../share';

export interface ModuleSettingsProps {
  getListApi: Api<any, GetModuleSettingResponse>;
  forms: {
    [name: string]: {
      title: React.ReactNode;
      description?: React.ReactNode;
      form: React.ReactElement;
    };
  };
}

export const ModuleSettings = ({ getListApi, forms }: ModuleSettingsProps) => {
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiForm
      api={getListApi}
      dataRender={({ data }) => (
        <Grid>
          {Object.entries(forms).map(([name, item]) => (
            <Grid.Col span={6} sm={12} key={name}>
              <Card withBorder>
                <Text weight={500} mb="xs">
                  {item.title}
                </Text>
                <Text size="sm" color="dimmed">
                  {item.description}
                </Text>
                {React.cloneElement(item.form, {
                  apiParams: data?.items.find((i) => i.name === name),
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
            </Grid.Col>
          ))}
        </Grid>
      )}
    />
  );
};
