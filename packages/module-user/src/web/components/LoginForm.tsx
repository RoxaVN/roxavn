import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiForm } from '@roxavn/core/web';

import { Apis } from '../../share';
import { webModule } from '../module';

interface LoginFormProps {
  onSuccess?: (data: InferApiResponse<typeof Apis.Login>) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps): JSX.Element => {
  const { t } = webModule.useTranslation();
  return (
    <div>
      <Title order={4} align="center">
        {t('login')}
      </Title>
      <ApiForm
        api={webModule.base.api(Apis.Login)}
        fields={[
          <TextInput
            label={t('email')}
            name="email"
            placeholder="example@email.com"
          />,
          <PasswordInput label={t('password')} name="password" />,
        ]}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export { LoginForm };
