import { Select, TextInput } from '@mantine/core';
import {
  ApiTable,
  IfCanAccessApi,
  webModule as coreWebModule,
  utils,
  ApiFormGroup,
  ApiConfirmFormGroup,
} from '@roxavn/core/web';
import { IconEdit, IconInbox, IconPlus, IconTrash } from '@tabler/icons';

import { constants, projectApi } from '../../base';
import { webModule } from '../module';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={projectApi.getMany}
      header={t('projects')}
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
      cellActions={(item) => [
        {
          label: tCore('edit'),
          icon: IconEdit,
          modal: {
            title: t('editProject'),
            children: (
              <ApiFormGroup
                api={projectApi.update}
                apiParams={{
                  projectId: item.id,
                  name: item.name,
                  type: item.type,
                }}
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
        {
          label: tCore('delete'),
          icon: IconTrash,
          modal: (closeModal) => ({
            title: t('deleteProject'),
            children: (
              <ApiConfirmFormGroup
                api={projectApi.delete}
                apiParams={{ projectId: item.id }}
                onCancel={closeModal}
              />
            ),
          }),
        },
      ]}
    />
  );
};

webModule.adminPages.push({
  label: (t) => t('projects'),
  path: '/project',
  icon: IconInbox,
  element: (
    <IfCanAccessApi api={projectApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
