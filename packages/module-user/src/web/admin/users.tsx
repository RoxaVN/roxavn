import { TextInput } from '@mantine/core';
import { Prism } from '@mantine/prism';
import {
  ApiFormGroup,
  ApiTable,
  uiManager,
  webModule as coreWebModule,
  utils,
  DateRangePicker,
  IfCanAccessApi,
  ApiConfirmFormGroup,
} from '@roxavn/core/web';
import { IconEye, IconKey, IconPlus, IconUsers } from '@tabler/icons';

import {
  passwordIdentityApi,
  userApi,
  userRoleApi,
  WebRoutes,
} from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  return (
    <ApiTable
      api={userApi.getMany}
      header={t('userList')}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          modal: {
            title: t('addUser'),
            children: (
              <ApiFormGroup
                api={userApi.create}
                fields={[
                  {
                    name: 'username',
                    input: <TextInput label={t('username')} />,
                  },
                ]}
              />
            ),
          },
        },
      ]}
      filters={[
        {
          name: 'username',
          input: <TextInput label={t('username')} />,
        },
        {
          name: 'createdDate',
          input: <DateRangePicker label={tCore('createdDate')} />,
        },
      ]}
      columns={{
        username: { label: t('username') },
        email: { label: t('email') },
        createdDate: {
          label: tCore('createdDate'),
          render: utils.Render.datetime,
        },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
      cellActions={(item) => [
        {
          label: t('roles'),
          icon: IconEye,
          access: { api: userRoleApi.getAll },
          link: { href: `user-roles/${item.id}` },
        },
        {
          label: t('resetPassword'),
          icon: IconKey,
          modal: (onClose) => ({
            title: t('resetuserPassword', { username: item.username }),
            children: (
              <ApiConfirmFormGroup
                api={passwordIdentityApi.recovery}
                apiParams={{ userId: item.id }}
                onCancel={onClose}
                onSuccess={(data) => {
                  const link = WebRoutes.ResetPassword.generate({
                    userId: item.id,
                    username: item.username,
                    token: data.token,
                  });
                  uiManager.alertModal(
                    <div>
                      <p>
                        {t('sendResetPasswordLink', {
                          name: item.username,
                        })}
                      </p>
                      <Prism
                        language="markdown"
                        copyLabel={tCore('copy')}
                        copiedLabel={tCore('copied')}
                      >
                        {`${location.protocol}://${location.host}${link}`}
                      </Prism>
                    </div>
                  );
                }}
              />
            ),
          }),
        },
      ]}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('userList'),
  path: '/',
  icon: IconUsers,
  element: (
    <IfCanAccessApi api={userApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
