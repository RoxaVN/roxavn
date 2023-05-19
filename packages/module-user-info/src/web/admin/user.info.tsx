import {
  ApiTable,
  IfCanAccessApi,
  webModule as coreWebModule,
  utils,
  PageItem,
  ModuleT,
} from '@roxavn/core/web';
import { ApiAvatar } from '@roxavn/module-upload/web';
import { IconUserCircle } from '@tabler/icons-react';

import { userInfoApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={userInfoApi.getMany}
      header={t('userInfo')}
      columns={{
        avatar: {
          label: t('avatar'),
          render: (avatar) => avatar && <ApiAvatar file={avatar} />,
        },
        firstName: { label: t('firstName') },
        middleName: { label: t('middleName') },
        lastName: { label: t('lastName') },
        birthday: { label: t('birthday') },
        gender: { label: t('gender') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

export const userInfoPage = new PageItem({
  label: <ModuleT module={webModule} k="userInfo" />,
  path: '',
  icon: IconUserCircle,
  element: (
    <IfCanAccessApi api={userInfoApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
