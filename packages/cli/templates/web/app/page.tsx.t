---
to: src/web/app/<%= h.changeCase.dot(path_name) %>.tsx
---
import { ModuleT, PageItem } from '@roxavn/core/web';
import { IconUsers } from '@tabler/icons-react';

import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();

  return <div>{t('test')}</div>;
};

export const <%= h.changeCase.camel(path_name) %>Page = new PageItem({
  label: <ModuleT module={webModule} k="<%= h.changeCase.camel(path_name) %>" />,
  path: '<%= h.changeCase.param(path_name) %>',
  icon: IconUsers,
  element: <Page />,
});
