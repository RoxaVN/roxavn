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
import { IconPlus } from '@tabler/icons';

import { CreateUserApi, GetUsersApi, WebRoutes } from '../../../../../share';
import { webModule } from '../../../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      header={t('userList')}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          onClick: (fetcherRef) =>
            uiManager.formDialog(
              t('addUser'),
              <ApiFormGroup
                api={webModule.api(CreateUserApi)}
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
                        {t('sendResetPasswordLink', { name: params.username })}
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
      api={webModule.api(GetUsersApi)}
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

export default IndexPage;
