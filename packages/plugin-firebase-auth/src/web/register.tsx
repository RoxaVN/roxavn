import { JsonInput } from '@mantine/core';
import { ApiFormGroup, ArrayInput, ModuleT } from '@roxavn/core/web';
import { webModule as userWebModule } from '@roxavn/module-user/web';

import { constants, settingApi } from '../base';
import { webModule } from './module';

userWebModule.adminSettings[constants.FIREBASE_SERVER_SETTING] = {
  title: <ModuleT module={webModule} k="firebaseServerSetting" />,
  form: (
    <ApiFormGroup
      api={settingApi.updateFirbaseServerSetting}
      fields={[
        {
          name: 'serviceAccounts',
          input: (
            <ArrayInput
              fields={
                <JsonInput
                  autosize
                  minRows={4}
                  maxRows={10}
                  placeholder="Content of serviceAccountKey.json"
                />
              }
            />
          ),
        },
      ]}
    />
  ),
};
