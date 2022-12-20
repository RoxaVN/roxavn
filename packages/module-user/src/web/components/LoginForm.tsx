import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiForm, SubmitButton } from '@roxavn/core/web';

import { LoginApi } from '../../share';
import { auth } from '../services';
import { webModule } from '../module';

interface LoginFormProps {
  onSuccess?: (data: InferApiResponse<typeof LoginApi>) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps): JSX.Element => {
  const { t } = webModule.useTranslation();
  return (
    <div>
      <Title order={4} align="center" mb="md">
        {t('login')}
      </Title>
      <ApiForm
        initialValues={{ username: '', password: '' }}
        api={webModule.api(LoginApi)}
        onSuccess={(data) => {
          auth.setToken(data.accessToken);
          onSuccess && onSuccess(data);
        }}
      >
        {(form) => (
          <>
            <TextInput
              mb="md"
              label={t('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              mb="md"
              autoComplete="true"
              label={t('password')}
              {...form.getInputProps('password')}
            />
            <SubmitButton fullWidth />
          </>
        )}
      </ApiForm>
    </div>
  );
};
