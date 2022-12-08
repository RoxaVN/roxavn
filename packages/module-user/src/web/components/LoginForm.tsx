import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiForm } from '@roxavn/core/web';

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
      <Title order={4} align="center">
        {t('login')}
      </Title>
      <ApiForm
        api={webModule.api(LoginApi)}
        fields={[
          <TextInput label={t('username')} name="username" />,
          <PasswordInput label={t('password')} name="password" />,
        ]}
        onSuccess={(data) => {
          auth.setToken(data.accessToken);
          onSuccess && onSuccess(data);
        }}
      />
    </div>
  );
};
