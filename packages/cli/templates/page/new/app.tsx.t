---
to: src/web/pages/web/app/{moduleName}.tsx
---
import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { IconUsers } from '@tabler/icons';

import { webModule } from '../../../module';

webModule.appMenu.push(
  ...[
    {
      label: '<%= path_name %>',
      path: '<%= path_name %>',
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
