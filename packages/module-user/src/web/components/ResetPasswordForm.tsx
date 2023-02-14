import { TextInput, PasswordInput, Title } from '@mantine/core';
import { Api, InferApiRequest, InferApiResponse } from '@roxavn/core/base';
import { ApiFormGroup } from '@roxavn/core/web';

import { passwordIdentityApi } from '../../base';
import { webModule } from '../module';

interface ResetPasswordFormProps {
  username: string;
  token: string;
  onSuccess?: (
    data: InferApiResponse<typeof passwordIdentityApi.reset>
  ) => void;
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
        api={
          passwordIdentityApi.reset as Api<
            InferApiRequest<typeof passwordIdentityApi.reset> & {
              retypePassword: string;
            }
          >
        }
        apiParams={{ username, token }}
        onSuccess={(data) => onSuccess && onSuccess(data)}
        onBeforeSubmit={(params) => {
          if (params.password !== params.retypePassword) {
            throw { retypePassword: t('wrongRetypePassword') };
          }
          return params;
        }}
        fields={[
          {
            name: 'username',
            input: <TextInput disabled label={t('username')} />,
          },
          {
            name: 'password',
            input: <PasswordInput autoComplete="true" label={t('password')} />,
          },
          {
            name: 'retypePassword',
            input: <PasswordInput label={t('retypePassword')} />,
          },
        ]}
      />
    </div>
  );
};
