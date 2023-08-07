import { TextInput } from '@mantine/core';
import { ApiFormGroup, ModuleT, ObjectInput } from '@roxavn/core/web';
import { webModule as utilsWebModule } from '@roxavn/module-utils/web';

import { constants, settingApi } from '../base/index.js';
import { webModule } from './module.js';

export default function () {
  utilsWebModule.adminSettings[constants.EMAIL_SENDER_SETTING] = {
    title: <ModuleT module={webModule} k="emailsenderSetting" />,
    form: (
      <ApiFormGroup
        api={settingApi.updateEmailSenderSetting}
        fields={[
          {
            name: 'transportOptions',
            input: (
              <ObjectInput
                autosize
                minRows={4}
                maxRows={10}
                label={
                  <a
                    href="https://nodemailer.com/smtp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ModuleT module={webModule} k="transportOptions" />
                  </a>
                }
              />
            ),
          },
          {
            name: 'sender',
            input: (
              <TextInput label={<ModuleT module={webModule} k="sender" />} />
            ),
          },
        ]}
      />
    ),
  };
}
