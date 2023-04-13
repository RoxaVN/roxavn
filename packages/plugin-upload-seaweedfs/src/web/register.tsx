import { TextInput } from '@mantine/core';
import { ApiFormGroup, ModuleT } from '@roxavn/core/web';
import { webModule as uploadWebModule } from '@roxavn/module-upload/web';

import { constants, settingApi } from '../base';
import { webModule } from './module';

export default function () {
  uploadWebModule.adminSettings[constants.SEAWEEDFS_MASTER_URL_SETTING] = {
    title: <ModuleT module={webModule} k="updateSeaweedFSMasterUrlSetting" />,
    form: (
      <ApiFormGroup
        api={settingApi.updateSeaweedFSMasterUrlSetting}
        fields={[
          {
            name: 'url',
            input: <TextInput placeholder="Default http://localhost:9333" />,
          },
        ]}
      />
    ),
  };
}
