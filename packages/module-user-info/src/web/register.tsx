import { Select, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { ApiFormGroup, ModuleT, useApi, useAuthUser } from '@roxavn/core/web';
import { ApiImageUploader } from '@roxavn/module-upload/web';
import { webModule as userWebModule } from '@roxavn/module-user/web';
import { IconInfoCircle } from '@tabler/icons-react';

import { constants, userInfoApi } from '../base';
import { webModule } from './module';

const Page = () => {
  const user = useAuthUser();
  const { t } = webModule.useTranslation();
  const { data } = useApi(userInfoApi.getOne, { userId: user?.id });

  return (
    data && (
      <ApiFormGroup
        api={userInfoApi.update}
        apiParams={{
          ...data,
          userId: user?.id,
        }}
        fields={[
          { name: 'avatar', input: <ApiImageUploader /> },
          [
            { name: 'firstName', input: <TextInput label={t('firstName')} /> },
            {
              name: 'middleName',
              input: <TextInput label={t('middleName')} />,
            },
            { name: 'lastName', input: <TextInput label={t('lastName')} /> },
          ],
          [
            {
              name: 'birthday',
              input: <DatePickerInput label={t('birthday')} />,
            },
            {
              name: 'gender',
              input: (
                <Select
                  clearable
                  label={t('gender')}
                  data={Object.values(constants.Genders).map((gender) => ({
                    value: gender,
                    label: t(gender) || gender,
                  }))}
                />
              ),
            },
          ],
        ]}
      />
    )
  );
};

export default function () {
  userWebModule.mePages.push({
    label: <ModuleT module={webModule} k="userInfo" />,
    icon: IconInfoCircle,
    path: '',
    element: <Page />,
  });
}
