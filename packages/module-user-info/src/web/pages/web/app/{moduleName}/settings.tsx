import { MultiSelect } from '@mantine/core';
import { ApiFormGroup } from '@roxavn/core/web';
import { ModuleSettings } from '@roxavn/module-utils/web';

import {
  GetSettingsApi,
  SetFieldsForAdminToUpdateApi,
  SetFieldsForUserToUpdateApi,
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
      getListApi={webModule.api(GetSettingsApi)}
      forms={{
        [settingConstant.fieldsForUserToUpdate]: {
          title: t('fieldsForUserToUpdateTitle'),
          form: (
            <ApiFormGroup
              api={webModule.api(SetFieldsForUserToUpdateApi)}
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
              api={webModule.api(SetFieldsForAdminToUpdateApi)}
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
