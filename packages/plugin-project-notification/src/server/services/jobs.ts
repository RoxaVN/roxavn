import {
  BaseService,
  InferOnApiSuccessData,
  inject,
  useApiEventJob,
} from '@roxavn/core/server';
import { CreateNotificationService } from '@roxavn/module-notification/server';
import { scopes, taskApi } from '@roxavn/module-project/base';
import { GetTaskApiService } from '@roxavn/module-project/server';

import { baseModule } from '../../base/index.js';

@useApiEventJob(taskApi.createSubtask)
export class CreateSubTaskNoticeService extends BaseService {
  constructor(
    @inject(GetTaskApiService) private getTaskApiService: GetTaskApiService,
    @inject(CreateNotificationService)
    private createNotificationService: CreateNotificationService
  ) {
    super();
  }

  async handle(data: InferOnApiSuccessData<typeof taskApi.createSubtask>) {
    const task = await this.getTaskApiService.handle({
      taskId: data.request.taskId,
    });

    const userIds = [task.userId];
    if (task.assignee && task.assignee !== task.userId) {
      userIds.push(task.assignee);
    }
    await await this.createNotificationService.handle({
      action: 'CreateSubTask',
      module: baseModule.name,
      resource: scopes.Task.name,
      resourceId: data.request.taskId,
      userIds,
      actorId: data.user?.id,
      metadata: { task: task.title, subtask: data.request.title },
    });
  }
}
