import { Select, TextInput } from '@mantine/core';
import { ApiFormGroup, DatePicker, ModuleT } from '@roxavn/core/web';
import { ApiImageUploader } from '@roxavn/module-upload/web';
import {
  authProvider,
  webModule as userWebModule,
} from '@roxavn/module-user/web';

import { constants, userInfoApi } from '../base';
import { webModule } from './module';

const Page = () => {
  const user = authProvider.getUser();
  const { t } = webModule.useTranslation();

  return (
    <ApiFormGroup
      api={userInfoApi.update}
      apiParams={{
        userId: user.id,
      }}
      fields={[
        { name: 'avatar', input: <ApiImageUploader /> },
        [
          { name: 'firstName', input: <TextInput label={t('firstName')} /> },
          { name: 'middleName', input: <TextInput label={t('middleName')} /> },
          { name: 'lastName', input: <TextInput label={t('lastName')} /> },
        ],
        [
          { name: 'birthday', input: <DatePicker label={t('birthday')} /> },
          {
            name: 'gender',
            input: (
              <Select
                clearable
                label={t('gender')}
                data={Object.values(constants.Genders).map((gender) => ({
                  value: gender,
                  label: t(gender),
                }))}
              />
            ),
          },
        ],
      ]}
    />
  );
};

userWebModule.mePages.push({
  label: <ModuleT module={webModule} k="userInfo" />,
  path: '/',
  element: <Page />,
});
