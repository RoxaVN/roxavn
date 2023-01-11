import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiFormGroup } from '@roxavn/core/web';

import { resetPasswordApi } from '../../share';
import { webModule } from '../module';

interface ResetPasswordFormProps {
  username: string;
  token: string;
  onSuccess?: (data: InferApiResponse<typeof resetPasswordApi>) => void;
}

export const ResetPasswordForm = ({
  username,
  token,
  onSuccess,
}: ResetPasswordFormProps): JSX.Element => {
  const { t } = webModule.useTranslation();
  return (
    <div>
      <Title order={4} align="center" mb="md">
        {t('resetPassword')}
      </Title>
      <ApiFormGroup
        api={resetPasswordApi}
        apiParams={{
          username,
          token,
          password: '',
          retypePassword: '',
        }}
        onSuccess={(data) => onSuccess && onSuccess(data)}
        onBeforeSubmit={(params) => {
          if (params.password !== params.retypePassword) {
            throw { retypePassword: t('wrongRetypePassword') };
          }
          return {
            password: params.password,
            username,
            token,
          };
        }}
        fields={[
          <TextInput disabled label={t('username')} name="username" />,
          <PasswordInput
            autoComplete="true"
            label={t('password')}
            name="password"
          />,
          <PasswordInput label={t('retypePassword')} name="retypePassword" />,
        ]}
      />
    </div>
  );
};
