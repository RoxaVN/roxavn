import { BaseService, InferApiSuccessData, inject } from '@roxavn/core/server';
import { CreateNotificationService } from '@roxavn/module-notification/server';
import { scopes, taskApi } from '@roxavn/module-project/base';
import { GetTaskApiService } from '@roxavn/module-project/server';

import { baseModule } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApiSuccessJob(taskApi.createSubtask)
export class CreateSubTaskNoticeService extends BaseService {
  constructor(
    @inject(GetTaskApiService) private getTaskApiService: GetTaskApiService,
    @inject(CreateNotificationService)
    private createNotificationService: CreateNotificationService
  ) {
    super();
  }

  async handle(data: InferApiSuccessData<typeof taskApi.createSubtask>) {
    const task = await this.getTaskApiService.handle({
      taskId: data.request.taskId,
    });

    const userIds = [task.userId];
    if (task.assignee && task.assignee !== task.userId) {
      userIds.push(task.assignee);
    }
    await this.createNotificationService.handle({
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

@serverModule.useApiSuccessJob(taskApi.inprogress)
export class InprogressTaskNoticeService extends BaseService {
  constructor(
    @inject(GetTaskApiService) private getTaskApiService: GetTaskApiService,
    @inject(CreateNotificationService)
    private createNotificationService: CreateNotificationService
  ) {
    super();
  }

  async handle(data: InferApiSuccessData<typeof taskApi.inprogress>) {
    const task = await this.getTaskApiService.handle({
      taskId: data.request.taskId,
    });

    await this.createNotificationService.handle({
      action: 'UpdateTaskStatus',
      module: baseModule.name,
      resource: scopes.Task.name,
      resourceId: data.request.taskId,
      userIds: [task.userId],
      actorId: data.user?.id,
      metadata: { task: task.title, context: 'inprogress' },
    });
  }
}

@serverModule.useApiSuccessJob(taskApi.delete)
export class DeleteTaskNoticeService extends BaseService {
  constructor(
    @inject(GetTaskApiService) private getTaskApiService: GetTaskApiService,
    @inject(CreateNotificationService)
    private createNotificationService: CreateNotificationService
  ) {
    super();
  }

  async handle(data: InferApiSuccessData<typeof taskApi.delete>) {
    const task = await this.getTaskApiService.handle({
      taskId: data.request.taskId,
    });

    await this.createNotificationService.handle({
      action: 'UpdateTaskStatus',
      module: baseModule.name,
      resource: scopes.Task.name,
      resourceId: data.request.taskId,
      userIds: [task.userId],
      actorId: data.user?.id,
      metadata: { task: task.title, context: 'delete' },
    });
  }
}

@serverModule.useApiSuccessJob(taskApi.reject)
export class RejectTaskNoticeService extends BaseService {
  constructor(
    @inject(GetTaskApiService) private getTaskApiService: GetTaskApiService,
    @inject(CreateNotificationService)
    private createNotificationService: CreateNotificationService
  ) {
    super();
  }

  async handle(data: InferApiSuccessData<typeof taskApi.reject>) {
    const task = await this.getTaskApiService.handle({
      taskId: data.request.taskId,
    });

    await this.createNotificationService.handle({
      action: 'UpdateTaskStatus',
      module: baseModule.name,
      resource: scopes.Task.name,
      resourceId: data.request.taskId,
      userIds: [task.userId],
      actorId: data.user?.id,
      metadata: { task: task.title, context: 'reject' },
    });
  }
}
