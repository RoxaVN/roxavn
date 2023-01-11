import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { IconSettings } from '@tabler/icons';

import { webModule } from '../../../module';

webModule.appMenu.push(
  ...[
    {
      label: 'settings',
      path: 'settings',
      icon: IconSettings,
    },
  ]
);

export default function () {
  const { setWebModule } = useOutletContext<any>();

  useEffect(() => {
    setWebModule(webModule);
  }, []);

  return <Outlet />;
}
