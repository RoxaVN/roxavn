import { JsonInput, TextInput } from '@mantine/core';
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

userWebModule.adminSettings[constants.FIREBASE_CLIENT_SETTING] = {
  title: <ModuleT module={webModule} k="firebaseClientSetting" />,
  form: (
    <ApiFormGroup
      api={settingApi.updateFirbaseClientSetting}
      fields={[
        {
          name: 'projectId',
          input: <TextInput placeholder="Project id" />,
        },
        {
          name: 'apiKey',
          input: <TextInput placeholder="Api key" />,
        },
        {
          name: 'authDomain',
          input: <TextInput placeholder="Auth domain" />,
        },
      ]}
    />
  ),
};
