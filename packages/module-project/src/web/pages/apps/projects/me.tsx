import { Select, TextInput } from '@mantine/core';
import {
  ApiFormGroup,
  ApiTable,
  authService,
  IsAuthenticatedPage,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { constants, projectApi } from '../../../../base';
import { webModule } from '../../../module';

function MePage() {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  const [userId, setuserid] = useState<string>();

  useEffect(() => {
    const tokenData = authService.getTokenData();
    if (tokenData) {
      setuserid(tokenData.userId);
    }
  }, []);

  return userId ? (
    <ApiTable
      api={projectApi.getManyJoined}
      apiParams={{ userId }}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          modal: {
            title: t('addProject'),
            children: (
              <ApiFormGroup
                api={projectApi.create}
                fields={[
                  { name: 'name', input: <TextInput label={tCore('name')} /> },
                  {
                    name: 'type',
                    input: (
                      <Select
                        label={tCore('type')}
                        data={Object.values(constants.ProjectTypes)}
                      />
                    ),
                  },
                ]}
              />
            ),
          },
        },
      ]}
      columns={{
        name: { label: tCore('name') },
        type: { label: tCore('type') },
        createdDate: {
          label: tCore('createdDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  ) : (
    <div />
  );
}

export default function () {
  return (
    <IsAuthenticatedPage>
      <MePage />
    </IsAuthenticatedPage>
  );
}
