import { TextInput, Box, Grid } from '@mantine/core';
import {
  AddButton,
  SubmitButton,
  FormModalTrigger,
  ApiForm,
  ApiTable,
  uiManager,
  CopyButton,
} from '@roxavn/core/web';

import { CreateUserApi, GetUsersApi, WebRoutes } from '../../../share';
import { webModule } from '../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
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
                  <Grid>
                    <Grid.Col span={2}>
                      <CopyButton
                        value={`${location.protocol}://${location.host}${link}`}
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      {t('sendResetPasswordLink', { name: params.username })}
                    </Grid.Col>
                  </Grid>
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
          { key: 'action', title: '' },
        ]}
      />
    </div>
  );
};

export default IndexPage;
