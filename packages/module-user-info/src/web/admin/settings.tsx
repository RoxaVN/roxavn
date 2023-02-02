import { MultiSelect } from '@mantine/core';
import {
  ApiFormGroup,
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
} from '../../share';
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
                <MultiSelect data={fields} withinPortal name="fields" />,
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
                <MultiSelect data={fields} withinPortal name="fields" />,
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
  render: Page,
});
