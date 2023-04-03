import { Select, TextInput } from '@mantine/core';
import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ServiceLoaderItem, servicesLoader } from '@roxavn/core/server';
import {
  ApiFormGroup,
  ApiTable,
  authService,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { constants, projectApi } from '../../../../base';
import { GetProjectsApiService } from '../../../../server';
import { webModule } from '../../../module';

export default function () {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  const [userId, setuserid] = useState<string>();
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    console.log(data);

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

export function loader(args: LoaderArgs) {
  return servicesLoader.load(args, {
    projects: new ServiceLoaderItem(GetProjectsApiService, {
      type: constants.ProjectTypes.PUBLIC,
    }),
  });
}
