import { MultiSelect } from '@mantine/core';
import { ApiFormGroup, ModuleT } from '@roxavn/core/web';

import { settingApi, constants } from '../../base';
import { webModule } from '../module';

const fields = constants.USER_INFO_FIELDS.map((v) => ({
  value: v,
  label: v,
}));

webModule.adminSettings[constants.FIELDS_FOR_USER_TO_UPDATE] = {
  title: <ModuleT module={webModule} k="fieldsForUserToUpdateTitle" />,
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
};
webModule.adminSettings[constants.FIELDS_FOR_ADMIN_TO_UPDATE] = {
  title: <ModuleT module={webModule} k="fieldsForAdminToUpdateTitle" />,
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
};
