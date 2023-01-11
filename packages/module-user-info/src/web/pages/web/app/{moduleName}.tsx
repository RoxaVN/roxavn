import { MenuItem, webModule as coreWebModule } from '@roxavn/core/web';
import { IconSettings } from '@tabler/icons';
import { useEffect } from 'react';
import { Translation } from 'react-i18next';
import { Outlet, useOutletContext } from 'react-router-dom';

import { webModule } from '../../../module';

webModule.appMenu.push(
  ...([
    {
      label: (
        <Translation ns={coreWebModule.escapedName}>
          {(t) => t('settings')}
        </Translation>
      ),
      path: 'settings',
      icon: IconSettings,
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
