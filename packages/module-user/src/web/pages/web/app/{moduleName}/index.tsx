import { TextInput, Box } from '@mantine/core';
import { Prism } from '@mantine/prism';
import {
  AddButton,
  FormModalTrigger,
  ApiFormGroup,
  ApiTable,
  uiManager,
  webModule as coreWebModule,
  utils,
  ApiFetcherRef,
  DatePicker,
} from '@roxavn/core/web';
import { useRef } from 'react';

import { CreateUserApi, GetUsersApi, WebRoutes } from '../../../../../share';
import { webModule } from '../../../../module';

const IndexPage = () => {
  const fetcherRef = useRef<ApiFetcherRef<typeof GetUsersApi>>();
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <div>
      <Box mb="md">
        <FormModalTrigger
          title={t('addUser')}
          content={({ successHandler }) => (
            <ApiFormGroup
              api={webModule.api(CreateUserApi)}
              apiParams={{ username: '' }}
              onSuccess={(data, params) => {
                successHandler();
                fetcherRef.current?.fetch({ page: 1 });
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
          )}
        >
          <AddButton />
        </FormModalTrigger>
      </Box>
      <ApiTable
        fetcherRef={fetcherRef}
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
    </div>
  );
};

export default IndexPage;
