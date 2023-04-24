import { Anchor, Badge, Card, Group, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { utils, webModule as coreWebModule } from '@roxavn/core/web';

import { constants, ProjectResponse, webRoutes } from '../../base';

export interface ProjectInfoProps {
  project: ProjectResponse;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const { t } = coreWebModule.useTranslation();

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
          {t(project.type)}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {utils.Render.relativeTime(project.createdDate)}
      </Text>
    </Card>
  );
};
