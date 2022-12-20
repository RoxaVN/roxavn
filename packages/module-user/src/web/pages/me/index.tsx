import { TextInput } from '@mantine/core';
import {
  AddButton,
  SubmitButton,
  FormModalTrigger,
  ApiForm,
} from '@roxavn/core/web';

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
          initialValues={{ username: '' }}
        >
          {(form) => (
            <>
              <TextInput
                mb="md"
                label={t('username')}
                {...form.getInputProps('username')}
              />
              <SubmitButton fullWidth />
            </>
          )}
        </ApiForm>
      }
    >
      <AddButton />
    </FormModalTrigger>
  );
};

export default IndexPage;
