import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { IconUsers } from '@tabler/icons';

import { webModule } from '../../../module';

webModule.appMenu.push(
  ...[
    {
      label: 'userFiles',
      path: '',
      icon: IconUsers,
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
