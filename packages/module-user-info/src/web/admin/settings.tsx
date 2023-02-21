import { MultiSelect } from '@mantine/core';
import {
  ApiFormGroup,
  IfCanAccessApi,
  ModuleT,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { ModuleSettings } from '@roxavn/module-utils/web';
import { IconSettings } from '@tabler/icons';

import { settingApi, constants } from '../../base';
import { webModule } from '../module';

const fields = constants.USER_INFO_FIELDS.map((v) => ({
  value: v,
  label: v,
}));

const Page = () => {
  const { t } = webModule.useTranslation();

  return (
    <ModuleSettings
      getListApi={settingApi.getAll}
      forms={{
        [constants.FIELDS_FOR_USER_TO_UPDATE]: {
          title: t('fieldsForUserToUpdateTitle'),
          form: (
            <ApiFormGroup
              api={settingApi.setFieldsForUserToUpdate}
              fields={[
                {
                  name: 'fields',
                  input: <MultiSelect data={fields} withinPortal />,
                },
              ]}
            />
          ),
        },
        [constants.FIELDS_FOR_ADMIN_TO_UPDATE]: {
          title: t('fieldsForAdminToUpdateTitle'),
          form: (
            <ApiFormGroup
              api={settingApi.setFieldsForAdminToUpdate}
              fields={[
                {
                  name: 'fields',
                  input: <MultiSelect data={fields} withinPortal />,
                },
              ]}
            />
          ),
        },
      }}
    />
  );
};

webModule.adminPages.push({
  label: <ModuleT module={coreWebModule} k="settings" />,
  icon: IconSettings,
  path: '/settings',
  element: (
    <IfCanAccessApi api={settingApi.getAll}>
      <Page />
    </IfCanAccessApi>
  ),
});
