---
to: src/web/me/<%= h.changeCase.dot(path_name) %>.tsx
---
import { PageItem } from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons';

import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();

  return <div>{t('test')}</div>;
};

export const <%= h.changeCase.camel(path_name) %>Page = new PageItem({
  label: (t) => t('<%= h.changeCase.camel(path_name) %>'),
  path: '/<%= h.changeCase.param(path_name) %>',
  icon: IconUsers,
  element: <Page />,
});
