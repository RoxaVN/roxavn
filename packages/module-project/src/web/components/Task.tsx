import { Badge, Card, Group, Table, Text } from '@mantine/core';
import {
  userService,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';

import { TaskResponse, constants } from '../../base';
import { webModule } from '../module';

export interface TaskInfoProps {
  task: TaskResponse;
}

function mapColor(status: string) {
  switch (status) {
    case constants.TaskStatus.FINISHED:
      return 'green';
    case constants.TaskStatus.REJECTED:
      return 'red';
    case constants.TaskStatus.PENDING:
      return 'gray';
  }
  return undefined;
}

export function TaskInfo({ task }: TaskInfoProps) {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  const { renderItem } = userService.reference.use(
    { ids: [task.userId, task.assignee] },
    { cache: true }
  );

  return (
    <Card shadow="md" padding="md" radius="md" mb="md" withBorder>
      <Group position="apart" mb="xs">
        <Text weight={500}>{task.title}</Text>
        <Badge color={mapColor(task.status)} variant="light">
          {task.status === constants.TaskStatus.INPROGRESS
            ? utils.Render.percent(task.progress)
            : t(task.status)}
        </Badge>
      </Group>
      <Table>
        <tbody>
          <tr>
            <th>{tCore('creator')}</th>
            <td>{renderItem(task.userId)}</td>
          </tr>
          <tr>
            <th>{tCore('assignee')}</th>
            <td>{renderItem(task.assignee)}</td>
          </tr>
          <tr>
            <th>{tCore('createdDate')}</th>
            <td>{utils.Render.date(task.createdDate)}</td>
          </tr>
          <tr>
            <th>{tCore('expiryDate')}</th>
            <td>{utils.Render.date(task.expiryDate)}</td>
          </tr>
        </tbody>
      </Table>
    </Card>
  );
}

export interface TaskPreviewProps {
  task: TaskResponse;
}

export function TaskPreview({ task }: TaskPreviewProps) {
  const { t } = webModule.useTranslation();

  return (
    <Group position="apart">
      <Text weight={500}>{task.title}</Text>
      <Badge color={mapColor(task.status)} variant="light">
        {task.status === constants.TaskStatus.INPROGRESS
          ? utils.Render.percent(task.progress)
          : t(task.status)}
      </Badge>
    </Group>
  );
}
