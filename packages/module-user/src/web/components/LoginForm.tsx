import { InferApiResponse } from '@roxavn/core/share';

import { Apis } from '../../share';
import { webModule } from '../module';

interface LoginFormProps {
  onSuccess?: (data: InferApiResponse<typeof Apis.Login>) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps): JSX.Element => {
  const { t } = webModule.useTranslation();
  return (
    <div onClick={() => console.log(onSuccess)}>
      <h3 className="text-center mb-5">{t('login')}</h3>
    </div>
  );
};

export { LoginForm };
