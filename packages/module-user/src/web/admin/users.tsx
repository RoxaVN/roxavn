import { TextInput } from '@mantine/core';
import { Prism } from '@mantine/prism';
import {
  ApiFormGroup,
  ApiTable,
  uiManager,
  webModule as coreWebModule,
  utils,
  DateRangePicker,
} from '@roxavn/core/web';
import { IconEye, IconPlus, IconUsers } from '@tabler/icons';

import {
  createUserApi,
  getUserRolesApi,
  getUsersApi,
  WebRoutes,
} from '../../share';
import { webModule } from '../module';

webModule.adminPages.push({
  label: (t) => t('userList'),
  path: '/',
  icon: IconUsers,
  render: () => {
    const { t } = webModule.useTranslation();
    const tCore = coreWebModule.useTranslation().t;

    return (
      <ApiTable
        api={getUsersApi}
        header={t('userList')}
        headerActions={(fetcherRef) => [
          {
            label: tCore('add'),
            icon: IconPlus,
            dialog: {
              title: t('addUser'),
              content: (
                <ApiFormGroup
                  api={createUserApi}
                  apiParams={{ username: '' }}
                  onSuccess={(data, params) => {
                    fetcherRef.fetch({ page: 1 });
                    const link = WebRoutes.ResetPassword.generate(
                      {},
                      {
                        username: params.username,
                        token: data.resetPasswordToken,
                      }
                    );
                    uiManager.alertDialog(
                      <div>
                        <p>
                          {t('sendResetPasswordLink', {
                            name: params.username,
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
            access: { api: getUserRolesApi },
            link: { href: `user-roles/${item.id}` },
          },
        ]}
      />
    );
  },
});
