import {
  ApiConfirmFormGroup,
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconActivity, IconList } from '@tabler/icons-react';

import { moduleApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={moduleApi.getMany}
      header={t('modules')}
      columns={{
        name: { label: tCore('name') },
        author: { label: tCore('creator') },
        version: { label: t('version') },
      }}
      cellActions={(item) => {
        const result = [];
        if ('./hook' in (item.exports || {})) {
          result.push({
            label: t('installHook'),
            icon: IconActivity,
            modal: ({ closeModal }: any) => ({
              title: t('installHookModule', { module: item.name }),
              children: (
                <ApiConfirmFormGroup
                  api={moduleApi.runInstallHook}
                  onCancel={closeModal}
                  apiParams={{ moduleName: item.name }}
                />
              ),
            }),
          });
        }
        return result;
      }}
    />
  );
};

export const modulePage = new PageItem({
  label: <ModuleT module={webModule} k="modules" />,
  path: '',
  icon: IconList,
  element: (
    <IfCanAccessApi api={moduleApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
