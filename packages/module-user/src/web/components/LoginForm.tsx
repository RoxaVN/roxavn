import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiFormGroup } from '@roxavn/core/web';

import { loginApi } from '../../share';
import { auth } from '../services';
import { webModule } from '../module';

interface LoginFormProps {
  onSuccess?: (data: InferApiResponse<typeof loginApi>) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps): JSX.Element => {
  const { t } = webModule.useTranslation();
  return (
    <div>
      <Title order={4} align="center" mb="md">
        {t('login')}
      </Title>
      <ApiFormGroup
        api={loginApi}
        onSuccess={(data) => {
          auth.setToken(data.accessToken);
          onSuccess && onSuccess(data);
        }}
        fields={[
          { name: 'username', input: <TextInput label={t('username')} /> },
          {
            name: 'password',
            input: <PasswordInput autoComplete="true" label={t('password')} />,
          },
        ]}
      />
    </div>
  );
};
