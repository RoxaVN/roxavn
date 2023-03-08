import { Menu } from '@mantine/core';
import { authService, useAuthUser } from '@roxavn/core/web';
import { IconLogout, IconUserCircle } from '@tabler/icons';
import { Link } from 'react-router-dom';

import { webModule } from '../module';
import { userReference } from '../references';

export const UserMenu = () => {
  const { t } = webModule.useTranslation();
  const authUser = useAuthUser();
  const { renderItem } = userReference.use({ ids: [authUser?.id] });

  return authUser ? (
    <Menu width={200} trigger="hover">
      <Menu.Target>
        <span>{renderItem(authUser.id)}</span>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconUserCircle size={14} />}
          component={Link}
          to="/me"
        >
          {t('myProfile')}
        </Menu.Item>
        <Menu.Item
          icon={<IconLogout size={14} />}
          component="button"
          onClick={() => {
            const token = authService.getTokenData();
            token && authService.logout(token);
          }}
        >
          {t('logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : null;
};
