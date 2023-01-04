import { TextInput, PasswordInput, Title } from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiForm, SubmitButton } from '@roxavn/core/web';

import { ResetPasswordApi } from '../../share';
import { webModule } from '../module';

interface ResetPasswordFormProps {
  username: string;
  token: string;
  onSuccess?: (data: InferApiResponse<typeof ResetPasswordApi>) => void;
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
      <ApiForm
        api={webModule.api(ResetPasswordApi)}
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
        formRender={(form) => (
          <>
            <TextInput
              mb="md"
              disabled
              label={t('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              mb="md"
              autoComplete="true"
              label={t('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              mb="md"
              label={t('retypePassword')}
              {...form.getInputProps('retypePassword')}
            />
            <SubmitButton fullWidth />
          </>
        )}
      />
    </div>
  );
};
