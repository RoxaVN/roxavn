import { TextInput } from '@mantine/core';
import { Prism } from '@mantine/prism';
import {
  ApiFormGroup,
  ApiTable,
  uiManager,
  webModule as coreWebModule,
  utils,
  DatePicker,
} from '@roxavn/core/web';
import { IconPlus, IconUsers } from '@tabler/icons';

import { createUserApi, getUsersApi, WebRoutes } from '../../share';
import { webModule } from '../module';

const Page = ({ api }: { api: typeof getUsersApi }) => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={api}
      header={t('userList')}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          onClick: (fetcherRef) =>
            uiManager.formDialog(
              t('addUser'),
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
                fields={[<TextInput label={t('username')} name="username" />]}
              />
            ),
        },
      ]}
      columns={{
        username: {
          label: t('username'),
          filterInput: <TextInput placeholder={t('username')} />,
        },
        email: { label: t('email') },
        createdDate: {
          label: tCore('createdDate'),
          render: utils.Render.datetime,
          filterInput: <DatePicker placeholder={tCore('createdDate')} />,
        },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('userList'),
  path: '/',
  icon: IconUsers,
  element: <Page api={getUsersApi} />,
});
