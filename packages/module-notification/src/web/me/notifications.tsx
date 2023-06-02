import { Anchor, Card, Text } from '@mantine/core';
import { BaseModule } from '@roxavn/core';
import { ApiList, ModuleT, PageItem, authService } from '@roxavn/core/web';
import { IconList } from '@tabler/icons-react';
import { Translation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { webModule } from '../module.js';
import { userNotificationApi } from '../../base/index.js';
import { notificationRouter } from '../router.js';

const Page = () => {
  const tokenData = authService.getTokenData();

  return (
    <ApiList
      api={userNotificationApi.getMany}
      apiParams={{ userId: tokenData?.userId }}
      itemRender={(item) => {
        const link = notificationRouter.getPath(item);
        return (
          <Card>
            <Translation ns={[BaseModule.escapeName(item.module)]}>
              {(tModule) =>
                link ? (
                  <Anchor component={Link} to={link}>
                    {tModule(item.action, item.metadata) as any}
                  </Anchor>
                ) : (
                  <Text>{tModule(item.action, item.metadata) as any}</Text>
                )
              }
            </Translation>
          </Card>
        );
      }}
    />
  );
};

export const notificationsPage = new PageItem({
  label: <ModuleT module={webModule} k="notifications" />,
  path: '',
  icon: IconList,
  element: <Page />,
});
