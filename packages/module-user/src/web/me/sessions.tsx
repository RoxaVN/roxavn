import { Button, Card, Group, Text } from '@mantine/core';
import {
  ApiConfirmFormGroup,
  ApiList,
  authService,
  ModuleT,
  PageItem,
  uiManager,
  utils,
} from '@roxavn/core/web';
import { IconCheckbox, IconCookie } from '@tabler/icons-react';
import { UAParser } from 'ua-parser-js';

import { accessTokenApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const tokenData = authService.getTokenData();
  const { t } = webModule.useTranslation();

  return (
    <ApiList
      api={accessTokenApi.getMany}
      apiParams={{ userId: tokenData?.userId }}
      itemRender={(item, fetcherRef) => {
        const parser = new UAParser(item.userAgent);
        const result = parser.getResult();

        const deleteToken = () => {
          uiManager.modal({
            title: t('logout'),
            children: (closeModal) => (
              <ApiConfirmFormGroup
                api={accessTokenApi.delete}
                apiParams={{ accessTokenId: item.id }}
                onCancel={closeModal}
                onSuccess={() => {
                  fetcherRef.fetch(fetcherRef.currentParams);
                  closeModal();
                }}
              />
            ),
          });
        };

        return (
          <Card>
            <Group position="apart">
              <Text weight="500">
                {item.ipAddress} - {item.userAgent ? result.os.name : ''}
              </Text>
              {tokenData?.id === item.id ? (
                <IconCheckbox color="green" />
              ) : (
                <Button variant="subtle" onClick={deleteToken}>
                  {t('logout')}
                </Button>
              )}
            </Group>
            <Text size="sm" color="dimmed">
              {utils.Render.relativeTime(item.updatedDate)}
            </Text>
          </Card>
        );
      }}
    />
  );
};

export const sessionsPage = new PageItem({
  label: <ModuleT module={webModule} k="sessions" />,
  path: 'sessions',
  icon: IconCookie,
  element: <Page />,
});
