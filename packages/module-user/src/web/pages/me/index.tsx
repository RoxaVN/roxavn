import { TextInput, Box } from '@mantine/core';
import {
  AddButton,
  SubmitButton,
  FormModalTrigger,
  ApiForm,
  ApiTable,
} from '@roxavn/core/web';

import { CreateUserApi, GetUsersApi } from '../../../share';
import { webModule } from '../../module';

const IndexPage = () => {
  const { t } = webModule.useTranslation();
  return (
    <div>
      <Box mb="md">
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
      </Box>
      <ApiTable
        api={webModule.api(GetUsersApi)}
        columns={[
          { key: 'username', title: t('username') },
          { key: 'email', title: t('email') },
          { key: 'action', title: '' },
        ]}
      />
    </div>
  );
};

export default IndexPage;
