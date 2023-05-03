import { Button, Card, Group, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { InferApiResponse } from '@roxavn/core/base';
import {
  ApiFormGroup,
  ModalTrigger,
  PaginationLinks,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { IconPlus } from '@tabler/icons-react';

import { TaskResponse, taskApi } from '../../base';
import { webModule } from '../module';
import { TaskPreview } from './Task';

export interface SubtasksProps {
  task: TaskResponse;
  subtasks: InferApiResponse<typeof taskApi.getSubtasks>;
}

export function Subtasks({ subtasks, task }: SubtasksProps) {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  return (
    <Card shadow="md" padding="md" radius="md" mb="md" withBorder>
      <Group position="apart" mb="xs">
        <Text weight={500}>{t('subtasks')}</Text>
        <ModalTrigger
          title={t('addSubtask')}
          content={({ navigate }) => (
            <ApiFormGroup
              api={taskApi.createSubtask}
              apiParams={{ taskId: task.id }}
              fields={[
                { name: 'title', input: <TextInput label={tCore('title')} /> },
                {
                  name: 'expiryDate',
                  input: (
                    <DatePickerInput
                      label={tCore('expiryDate')}
                      maxDate={task.expiryDate}
                      popoverProps={{ withinPortal: true }}
                    />
                  ),
                },
              ]}
              onSuccess={() => navigate()}
            />
          )}
        >
          <Button leftIcon={<IconPlus size={16} />}>{tCore('add')}</Button>
        </ModalTrigger>
      </Group>
      <div>
        {subtasks.items.map((item) => (
          <TaskPreview key={item.id} task={item} />
        ))}
      </div>
      <PaginationLinks
        my="md"
        data={subtasks.pagination}
        locationKey="subtasks"
      />
    </Card>
  );
}
