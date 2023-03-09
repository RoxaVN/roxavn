import {
  ApiFormGroup,
  ArrayInput,
  ModuleT,
  ObjectInput,
} from '@roxavn/core/web';
import { webModule as utilsWebModule } from '@roxavn/module-utils/web';

import { constants, settingApi } from '../base';
import { webModule } from './module';

utilsWebModule.adminSettings[constants.FIREBASE_SERVER_SETTING] = {
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
                <ObjectInput
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
