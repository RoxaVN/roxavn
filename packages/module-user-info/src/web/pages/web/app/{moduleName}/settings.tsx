import { MultiSelect } from '@mantine/core';
import { ApiFormGroup } from '@roxavn/core/web';
import { ModuleSettings } from '@roxavn/module-utils/web';

import {
  getSettingsApi,
  setFieldsForAdminToUpdateApi,
  setFieldsForUserToUpdateApi,
  settingConstant,
} from '../../../../../share';
import { webModule } from '../../../../module';

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

export default Page;
