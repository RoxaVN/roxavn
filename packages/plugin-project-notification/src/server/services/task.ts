import {
  BaseService,
  InferOnApiSuccessData,
  onApiSuccess,
} from '@roxavn/core/server';
import { CreateNotificationService } from '@roxavn/module-notification/server';
import { scopes, taskApi } from '@roxavn/module-project/base';
import { GetTaskApiService } from '@roxavn/module-project/server';

import { baseModule } from '../../base/index.js';

@onApiSuccess(taskApi.createSubtask)
export class CreateSubTaskNoticeService extends BaseService {
  async handle(data: InferOnApiSuccessData<typeof taskApi.createSubtask>) {
    const task = await this.create(GetTaskApiService).handle({
      taskId: data.request.taskId,
    });

    const userIds = [task.userId];
    if (task.assignee && task.assignee !== task.userId) {
      userIds.push(task.assignee);
    }
    await await this.create(CreateNotificationService).handle({
      action: 'CreateSubTask',
      module: baseModule.name,
      resource: scopes.Task.name,
      resourceId: data.request.taskId,
      userIds,
      actorId: data.request.$user?.id,
      metadata: { task: task.title, subtask: data.request.title },
    });
  }
}
