import { useEffect } from 'react';
import { useOutletContext, useRoutes } from 'react-router-dom';

import { webModule } from '../../../../module';
import '../../../../admin';

export default function () {
  const { setWebModule } = useOutletContext<any>();
  const element = useRoutes(webModule.adminPages);

  useEffect(() => {
    setWebModule(webModule);
  }, []);

  return element;
}
