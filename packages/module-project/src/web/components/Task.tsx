import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Link } from '@remix-run/react';
import {
  ApiConfirmFormGroup,
  ApiFormGroup,
  ModalTrigger,
  userService,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import { TaskResponse, constants, webRoutes, taskApi } from '../../base';
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
        <Group spacing="md">
          <ModalTrigger
            title={t('editTask')}
            content={({ navigate }) => (
              <ApiFormGroup
                api={taskApi.update}
                apiParams={{
                  taskId: task.id,
                  title: task.title,
                  expiryDate: task.expiryDate,
                }}
                fields={[
                  {
                    name: 'title',
                    input: <TextInput label={tCore('title')} />,
                  },
                  {
                    name: 'expiryDate',
                    input: (
                      <DatePickerInput
                        label={tCore('expiryDate')}
                        popoverProps={{ withinPortal: true }}
                      />
                    ),
                  },
                ]}
                onSuccess={() => navigate()}
              />
            )}
          >
            <Button leftIcon={<IconEdit size={16} />} variant="outline">
              {tCore('edit')}
            </Button>
          </ModalTrigger>
          <ModalTrigger
            title={t('deleteTask')}
            content={({ navigate, setOpened }) => (
              <ApiConfirmFormGroup
                api={taskApi.delete}
                apiParams={{
                  taskId: task.id,
                }}
                onCancel={() => setOpened(false)}
                onSuccess={() =>
                  navigate(
                    task.parentId &&
                      webRoutes.Task.generate({ taskId: task.parentId })
                  )
                }
              />
            )}
          >
            <Button
              leftIcon={<IconTrash size={16} />}
              color="red"
              variant="outline"
            >
              {tCore('delete')}
            </Button>
          </ModalTrigger>
        </Group>
      </Group>
      <Table>
        <tbody>
          <tr>
            <th>{tCore('status')}</th>
            <td>
              <Badge color={mapColor(task.status)} variant="light">
                {t(task.status)}
              </Badge>
            </td>
          </tr>
          <tr>
            <th>{tCore('creator')}</th>
            <td>{renderItem(task.userId)}</td>
          </tr>
          <tr>
            <th>{t('assignee')}</th>
            <td>{renderItem(task.assignee)}</td>
          </tr>
          <tr>
            <th>{t('progress')}</th>
            <td>{utils.Render.percent(task.progress)}</td>
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
      <Anchor
        component={Link}
        to={webRoutes.Task.generate({ taskId: task.id })}
      >
        <Text weight={500}>{task.title}</Text>
      </Anchor>
      <Badge color={mapColor(task.status)} variant="light">
        {task.status === constants.TaskStatus.INPROGRESS
          ? utils.Render.percent(task.progress)
          : t(task.status)}
      </Badge>
    </Group>
  );
}
