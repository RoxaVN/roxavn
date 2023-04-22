import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { ApiService, InferAuthApiRequest } from '@roxavn/core/server';

import {
  constants,
  DeleteTaskException,
  InvalidExpiryDateException,
  taskApi,
} from '../../base';
import { Task } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(taskApi.createSubtask)
export class CreateSubtaskApiService extends ApiService {
  async handle(request: InferAuthApiRequest<typeof taskApi.createSubtask>) {
    const task = await this.dbSession.getRepository(Task).findOne({
      where: { id: request.taskId },
      cache: true,
    });
    if (!task) {
      throw new NotFoundException();
    }
    if (task.expiryDate < request.expiryDate) {
      throw new InvalidExpiryDateException();
    }
    const subTask = new Task();
    subTask.userId = request.$user.id;
    subTask.title = request.title;
    subTask.expiryDate = request.expiryDate;
    subTask.projectId = task.projectId;
    subTask.parentId = task.id;
    subTask.parents = [...(task.parents || []), task.id];
    await this.dbSession.save(subTask);

    await this.dbSession
      .getRepository(Task)
      .increment({ id: request.taskId }, 'childrenCount', 1);

    return { id: subTask.id };
  }
}

@serverModule.useApi(taskApi.getSubtasks)
export class GetSubtasksApiService extends ApiService {
  async handle(request: InferAuthApiRequest<typeof taskApi.getSubtasks>) {
    const task = await this.dbSession.getRepository(Task).findOne({
      where: { id: request.taskId },
      cache: true,
    });
    if (!task) {
      throw new NotFoundException();
    }

    const page = request.page || 1;
    const pageSize = 10;
    const totalItems = task.childrenCount;
    const items = await this.dbSession.getRepository(Task).find({
      where: { parentId: task.id },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(taskApi.getOne)
export class GetTaskApiService extends ApiService {
  async handle(request: InferApiRequest<typeof taskApi.getOne>) {
    const result = await this.dbSession.getRepository(Task).findOne({
      where: { id: request.taskId },
      cache: true,
    });
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(taskApi.delete)
export class DeleteTaskApiService extends ApiService {
  async handle(request: InferApiRequest<typeof taskApi.delete>) {
    const task = await this.dbSession.getRepository(Task).findOne({
      where: { id: request.taskId },
      cache: true,
    });
    if (!task) {
      throw new NotFoundException();
    }
    if (
      !task.parentId ||
      task.childrenCount ||
      task.status !== constants.TaskStatus.PENDING
    ) {
      throw new DeleteTaskException();
    }
    await this.dbSession
      .getRepository(Task)
      .decrement({ id: task.parentId }, 'childrenCount', 1);
    return {};
  }
}
