import {
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Api } from '@roxavn/core/base';
import {
  ApiConfirmFormGroup,
  ApiFormGroup,
  ModalTrigger,
  userService,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import {
  IconBan,
  IconCheck,
  IconEdit,
  IconHammer,
  IconTrash,
  IconUser,
  IconUserSearch,
} from '@tabler/icons-react';

import {
  TaskResponse,
  constants,
  webRoutes,
  taskApi,
  scopes,
} from '../../base';
import { webModule } from '../module';

export interface TaskInfoProps {
  task: TaskResponse;
}

export function mapColor(status: string) {
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
  const renderUser = userService.reference.use(
    { ids: [task.userId, task.assignee] },
    { cache: true }
  ).renderItem;

  const renderAction = (
    status: string,
    api: Api,
    Icon: React.ComponentType<{ size: number }>
  ) => (
    <ModalTrigger
      key={status}
      title={t(status + 'Task')}
      content={({ navigate, setOpened }) => (
        <ApiConfirmFormGroup
          api={api}
          apiParams={{ taskId: task.id }}
          onCancel={() => setOpened(false)}
          onSuccess={() => navigate()}
        />
      )}
    >
      <Button
        leftIcon={<Icon size={16} />}
        color={mapColor(status)}
        variant="subtle"
      >
        {t(status)}
      </Button>
    </ModalTrigger>
  );
  const renderActions = () => {
    const result = [];
    if (task.status === constants.TaskStatus.PENDING) {
      result.push(
        renderAction(
          constants.TaskStatus.INPROGRESS,
          taskApi.inprogress,
          IconHammer
        )
      );
    } else if (task.status === constants.TaskStatus.INPROGRESS) {
      result.push(
        renderAction(constants.TaskStatus.FINISHED, taskApi.finish, IconCheck)
      );
    }
    if (result.length && task.childrenCount < 1) {
      // only reject subtask
      result.push(
        renderAction(constants.TaskStatus.REJECTED, taskApi.reject, IconBan)
      );
    }
    return result;
  };

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
                  weight: task.weight,
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
                  {
                    name: 'weight',
                    input: <NumberInput label={t('taskWeight')} />,
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
                apiParams={{ taskId: task.id }}
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
              <Group spacing="md">
                <Badge color={mapColor(task.status)} variant="light">
                  {t(task.status)}
                </Badge>
                {renderActions()}
              </Group>
            </td>
          </tr>
          <tr>
            <th>{tCore('creator')}</th>
            <td>{renderUser(task.userId)}</td>
          </tr>
          <tr>
            <th>{t('assignee')}</th>
            <td>
              {task.assignee ? (
                renderUser(task.assignee)
              ) : (
                <Group spacing="md">
                  <ModalTrigger
                    title={t('assignMe')}
                    content={({ navigate, setOpened }) => (
                      <ApiConfirmFormGroup
                        api={taskApi.assignMe}
                        apiParams={{ taskId: task.id }}
                        onCancel={() => setOpened(false)}
                        onSuccess={() => navigate()}
                      />
                    )}
                  >
                    <Button leftIcon={<IconUser size={16} />} variant="subtle">
                      {t('assignMe')}
                    </Button>
                  </ModalTrigger>
                  <ModalTrigger
                    title={t('assign')}
                    content={({ navigate }) => (
                      <ApiFormGroup
                        api={taskApi.assign}
                        apiParams={{ taskId: task.id }}
                        fields={[
                          {
                            name: 'userId',
                            input: (
                              <userService.roleUserInput
                                scope={scopes.Project.name}
                                scopeId={task.projectId}
                                label={t('assignee')}
                              />
                            ),
                          },
                        ]}
                        onSuccess={() => navigate()}
                      />
                    )}
                  >
                    <Button
                      leftIcon={<IconUserSearch size={16} />}
                      variant="subtle"
                    >
                      {t('assign')}
                    </Button>
                  </ModalTrigger>
                </Group>
              )}
            </td>
          </tr>
          <tr>
            <th>{t('progress')}</th>
            <td>
              {task.childrenWeight &&
                utils.Render.percent(task.progress / task.childrenWeight)}
            </td>
          </tr>
          <tr>
            <th>{t('taskWeight')}</th>
            <td>{task.weight}</td>
          </tr>
          <tr>
            <th>{tCore('createdDate')}</th>
            <td>{utils.Render.date(task.createdDate)}</td>
          </tr>
          <tr>
            <th>{tCore('expiryDate')}</th>
            <td>{utils.Render.date(task.expiryDate)}</td>
          </tr>
          {task.startedDate && (
            <tr>
              <th>{t('startedDate')}</th>
              <td>{utils.Render.datetime(task.startedDate)}</td>
            </tr>
          )}
          {task.finishedDate && (
            <tr>
              <th>{t('finishedDate')}</th>
              <td>{utils.Render.datetime(task.finishedDate)}</td>
            </tr>
          )}
          {task.rejectedDate && (
            <tr>
              <th>{t('rejectedDate')}</th>
              <td>{utils.Render.datetime(task.rejectedDate)}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}
