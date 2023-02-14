import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/base';
import { ApiFormGroup } from '@roxavn/core/web';

import { passwordIdentityApi } from '../../base';
import { authProvider } from '../services';
import { webModule } from '../module';

interface LoginFormProps {
  onSuccess?: (data: InferApiResponse<typeof passwordIdentityApi.auth>) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps): JSX.Element => {
  const { t } = webModule.useTranslation();
  return (
    <div>
      <Title order={4} align="center" mb="md">
        {t('login')}
      </Title>
      <ApiFormGroup
        api={passwordIdentityApi.auth}
        onSuccess={(data) => {
          authProvider.setTokenData(data);
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
