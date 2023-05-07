import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { Link } from '@remix-run/react';
import {
  ApiFormGroup,
  IfCanAccessApi,
  ModalTrigger,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconEdit } from '@tabler/icons-react';

import { constants, projectApi, ProjectResponse, webRoutes } from '../../base';

export interface ProjectInfoProps {
  project: ProjectResponse;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const tCore = coreWebModule.useTranslation().t;

  return (
    <Card shadow="md" padding="md" radius="md" mb="md" withBorder>
      <Group position="apart" mb="xs">
        <Anchor
          component={Link}
          to={webRoutes.Project.generate({ projectId: project.id })}
        >
          <Text weight={500}>{project.name}</Text>
        </Anchor>
        <Badge
          color={
            project.type === constants.ProjectTypes.PUBLIC ? 'green' : 'orange'
          }
          variant="light"
        >
          {tCore(project.type)}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {utils.Render.relativeTime(project.createdDate)}
      </Text>

      <Group position="right">
        <IfCanAccessApi
          api={projectApi.update}
          apiParams={{ projectId: project.id }}
        >
          <ModalTrigger
            title={tCore('edit')}
            content={({ navigate }) => (
              <ApiFormGroup
                api={projectApi.update}
                apiParams={{
                  projectId: project.id,
                  name: project.name,
                  type: project.type,
                }}
                fields={[
                  { name: 'name', input: <TextInput label={tCore('name')} /> },
                  {
                    name: 'type',
                    input: (
                      <Select
                        withinPortal
                        label={tCore('type')}
                        data={Object.values(constants.ProjectTypes)}
                      />
                    ),
                  },
                ]}
                onSuccess={() => navigate()}
              />
            )}
          >
            <Button leftIcon={<IconEdit size={16} />}>{tCore('edit')}</Button>
          </ModalTrigger>
        </IfCanAccessApi>
      </Group>
    </Card>
  );
};
