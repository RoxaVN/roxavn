import { MultiSelect } from '@mantine/core';
import {
  ApiFormGroup,
  IfCanAccessApi,
  ModuleT,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { ModuleSettings } from '@roxavn/module-utils/web';
import { IconSettings } from '@tabler/icons';

import {
  getSettingsApi,
  setFieldsForAdminToUpdateApi,
  setFieldsForUserToUpdateApi,
  settingConstant,
} from '../../base';
import { webModule } from '../module';

const fields = settingConstant.userInfoFields.map((v) => ({
  value: v,
  label: v,
}));

const Page = () => {
  const { t } = webModule.useTranslation();

  return (
    <ModuleSettings
      getListApi={getSettingsApi}
      forms={{
        [settingConstant.fieldsForUserToUpdate]: {
          title: t('fieldsForUserToUpdateTitle'),
          form: (
            <ApiFormGroup
              api={setFieldsForUserToUpdateApi}
              fields={[
                {
                  name: 'fields',
                  input: <MultiSelect data={fields} withinPortal />,
                },
              ]}
            />
          ),
        },
        [settingConstant.fieldsForAdminToUpdate]: {
          title: t('fieldsForAdminToUpdateTitle'),
          form: (
            <ApiFormGroup
              api={setFieldsForAdminToUpdateApi}
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
    <IfCanAccessApi api={getSettingsApi}>
      <Page />
    </IfCanAccessApi>
  ),
});
