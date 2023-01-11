import { MenuItem } from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons';
import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { webModule } from '../../../module';

webModule.appMenu.push(
  ...([
    {
      label: (t) => t('userList'),
      path: '',
      icon: IconUsers,
    },
  ] as MenuItem[])
);

export default function () {
  const { setWebModule } = useOutletContext<any>();

  useEffect(() => {
    setWebModule(webModule);
  }, []);

  return <Outlet />;
}
