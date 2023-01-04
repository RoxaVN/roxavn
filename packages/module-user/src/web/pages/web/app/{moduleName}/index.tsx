import { TextInput, Box } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Prism } from '@mantine/prism';
import {
  AddButton,
  SubmitButton,
  FormModalTrigger,
  ApiForm,
  ApiTable,
  uiManager,
  webModule as coreWebModule,
  utils,
  ApiFetcherRef,
} from '@roxavn/core/web';
import { useRef } from 'react';

import { CreateUserApi, GetUsersApi, WebRoutes } from '../../../../../share';
import { webModule } from '../../../../module';

const IndexPage = () => {
  const fetcherRef = useRef<ApiFetcherRef<typeof GetUsersApi>>();
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <div title="test">
      <Box mb="md">
        <FormModalTrigger
          title={t('addUser')}
          content={({ successHandler }) => (
            <ApiForm
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
              formRender={(form) => (
                <>
                  <TextInput
                    mb="md"
                    label={t('username')}
                    {...form.getInputProps('username')}
                  />
                  <SubmitButton fullWidth />
                </>
              )}
            />
          )}
        >
          <AddButton />
        </FormModalTrigger>
      </Box>
      <ApiTable
        fetcherRef={fetcherRef}
        api={webModule.api(GetUsersApi)}
        filters={{
          username: <TextInput label={t('username')} />,
          createdDate: <DatePicker label={tCore('createdDate')} />,
        }}
        columns={{
          username: { title: t('username') },
          email: { title: t('email') },
          createdDate: {
            title: tCore('createdDate'),
            render: utils.Render.datetime,
          },
          updatedDate: {
            title: tCore('updatedDate'),
            render: utils.Render.relativeTime,
          },
        }}
      />
    </div>
  );
};

export default IndexPage;
