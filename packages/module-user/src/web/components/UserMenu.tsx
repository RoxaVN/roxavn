import { Menu } from '@mantine/core';
import { authService, useAuthUser, userService } from '@roxavn/core/web';
import { IconLogout, IconUserCircle } from '@tabler/icons';
import { Link } from 'react-router-dom';

import { webModule } from '../module';

export const UserMenu = () => {
  const { t } = webModule.useTranslation();
  const authUser = useAuthUser();
  const { renderItem } = userService.reference.use(
    { ids: [authUser?.id] },
    { cache: true }
  );

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
