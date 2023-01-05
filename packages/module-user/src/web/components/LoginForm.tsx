import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiFormGroup } from '@roxavn/core/web';

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
      <ApiFormGroup
        api={webModule.api(LoginApi)}
        onSuccess={(data) => {
          auth.setToken(data.accessToken);
          onSuccess && onSuccess(data);
        }}
        fields={[
          <TextInput label={t('username')} name="username" />,
          <PasswordInput
            autoComplete="true"
            name="password"
            label={t('password')}
          />,
        ]}
      />
    </div>
  );
};
