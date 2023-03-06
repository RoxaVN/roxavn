import {
  ApiTable,
  IfCanAccessApi,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { ApiAvatar } from '@roxavn/module-upload/web';
import { IconUserCircle } from '@tabler/icons';

import { userInfoApi } from '../../base';
import { webModule } from '../module';

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

webModule.adminPages.push({
  label: (t) => t('userInfo'),
  path: '/',
  icon: IconUserCircle,
  element: (
    <IfCanAccessApi api={userInfoApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
