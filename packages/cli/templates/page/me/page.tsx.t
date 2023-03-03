---
to: src/web/me/<%= h.changeCase.dot(path_name) %>.tsx
---
import { IconUsers } from '@tabler/icons';

import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();

  return <div>{t('test')}</div>;
};

webModule.adminPages.push({
  label: (t) => t('test'),
  path: '/test',
  icon: IconUsers,
  element: <Page />,
});
