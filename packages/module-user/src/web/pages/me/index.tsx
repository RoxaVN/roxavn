import { TextInput } from '@mantine/core';
import { AddButton, FormModalTrigger, ApiForm } from '@roxavn/core/web';

import { CreateUserApi } from '../../../share';
import { webModule } from '../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  return (
    <FormModalTrigger
      title={t('addUser')}
      content={
        <ApiForm
          api={webModule.api(CreateUserApi)}
          fields={[<TextInput label={t('username')} name="username" />]}
        />
      }
    >
      <AddButton />
    </FormModalTrigger>
  );
};

export default IndexPage;
