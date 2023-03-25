import { Select, TextInput } from '@mantine/core';
import {
  ApiFormGroup,
  ApiTable,
  authService,
  ForceLogin,
  ModuleT,
  PageItem,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconInbox, IconPlus } from '@tabler/icons';

import { constants, projectApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  const tokenData = authService.getTokenData();

  return tokenData ? (
    <ApiTable
      api={projectApi.getManyJoined}
      apiParams={{ userId: tokenData.userId }}
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
};

export const projectsPage = new PageItem({
  label: <ModuleT module={webModule} k="projects" />,
  path: 'projects',
  icon: IconInbox,
  element: (
    <ForceLogin>
      <Page />
    </ForceLogin>
  ),
});
