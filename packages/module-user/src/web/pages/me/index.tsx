import { TextInput, Box } from '@mantine/core';
import {
  AddButton,
  SubmitButton,
  FormModalTrigger,
  ApiForm,
  ApiTable,
  uiManager,
  CopyButton,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';

import { CreateUserApi, GetUsersApi, WebRoutes } from '../../../share';
import { webModule } from '../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <div>
      <Box mb="md">
        <FormModalTrigger
          title={t('addUser')}
          content={({ successHandler }) => (
            <ApiForm
              api={webModule.api(CreateUserApi)}
              initialValues={{ username: '' }}
              onSuccess={(data, params) => {
                successHandler();
                const link = WebRoutes.ResetPassword.generate(
                  {},
                  {
                    username: params.username,
                    token: data.resetPasswordToken,
                  }
                );
                uiManager.alertDialog(
                  <div>
                    <Box sx={{ float: 'left' }} mr="md">
                      <CopyButton
                        value={`${location.protocol}://${location.host}${link}`}
                      />
                    </Box>
                    <span>
                      {t('sendResetPasswordLink', { name: params.username })}
                    </span>
                  </div>
                );
              }}
            >
              {(form) => (
                <>
                  <TextInput
                    mb="md"
                    label={t('username')}
                    {...form.getInputProps('username')}
                  />
                  <SubmitButton fullWidth />
                </>
              )}
            </ApiForm>
          )}
        >
          <AddButton />
        </FormModalTrigger>
      </Box>
      <ApiTable
        api={webModule.api(GetUsersApi)}
        columns={[
          { key: 'username', title: t('username') },
          { key: 'email', title: t('email') },
          {
            key: 'createdDate',
            title: tCore('createdDate'),
            render: utils.Render.datetime as any,
          },
          {
            key: 'updatedDate',
            title: tCore('updatedDate'),
            render: utils.Render.relativeTime as any,
          },
          { key: 'action', title: '' },
        ]}
      />
    </div>
  );
};

export default IndexPage;
