import { TextInput } from '@mantine/core';
import { ApiFormGroup, ModuleT } from '@roxavn/core/web';
import { webModule as uploadWebModule } from '@roxavn/module-upload/web';

import { constants, settingApi } from '../base/index.js';
import { webModule } from './module.js';

export default function () {
  uploadWebModule.adminSettings[constants.SEAWEEDFS_SETTING] = {
    title: <ModuleT module={webModule} k="updateSeaweedFSSetting" />,
    form: (
      <ApiFormGroup
        api={settingApi.updateSeaweedFSSetting}
        fields={[
          {
            name: 'masterUrl',
            input: (
              <TextInput
                placeholder={`Default ${constants.SEAWEEDFS_MASTER_URL_DEFAULT}`}
              />
            ),
          },
        ]}
      />
    ),
  };
}
