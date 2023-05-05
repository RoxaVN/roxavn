import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import {
  ApiService,
  InferAuthApiRequest,
  serviceManager,
} from '@roxavn/core/server';
import dayjs from 'dayjs';
import { IsNull } from 'typeorm';

import {
  AlreadyAssignedTaskException,
  constants,
  DeleteTaskException,
  InvalidExpiryDateSubtaskException,
  scopes,
  taskApi,
  UnassignedTaskException,
  UserNotInProjectException,
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
    // https://github.com/typeorm/typeorm/issues/2794#issuecomment-1202730034
    if (dayjs(task.expiryDate).isBefore(request.expiryDate)) {
      throw new InvalidExpiryDateSubtaskException(task.expiryDate);
    }
    if (!task.assignee) {
      throw new UnassignedTaskException();
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

@serverModule.useApi(taskApi.update)
export class UpdateTaskApiService extends ApiService {
  async handle(request: InferApiRequest<typeof taskApi.update>) {
    const task = await this.dbSession.getRepository(Task).findOne({
      where: { id: request.taskId },
      cache: true,
    });
    if (!task) {
      throw new NotFoundException();
    }
    if (task.parentId) {
      const parentTask = await this.dbSession.getRepository(Task).findOne({
        where: { id: task.parentId },
        select: ['expiryDate'],
      });
      if (!parentTask) {
        throw new NotFoundException();
      }
      if (dayjs(parentTask.expiryDate).isBefore(request.expiryDate)) {
        throw new InvalidExpiryDateSubtaskException(parentTask.expiryDate);
      }
    }

    await this.dbSession.getRepository(Task).update(
      { id: request.taskId },
      {
        title: request.title,
        expiryDate: request.expiryDate,
      }
    );
    return {};
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

@serverModule.useApi(taskApi.assign)
export class AssignTaskApiService extends ApiService {
  async handle(request: InferApiRequest<typeof taskApi.assign>) {
    const task = await this.dbSession.getRepository(Task).findOne({
      where: { id: request.taskId },
      cache: true,
    });
    if (!task) {
      throw new NotFoundException();
    }
    const resultCheck = await this.create(
      serviceManager.checkRoleUsersApiService
    ).handle({
      scopeId: task.projectId,
      scope: scopes.Project.name,
      userIds: [request.userId],
    });
    if (!resultCheck.success) {
      throw new UserNotInProjectException();
    }
    const result = await this.dbSession
      .getRepository(Task)
      .update(
        { id: request.taskId, assignee: IsNull() },
        { assignee: request.userId }
      );
    if (!result.affected) {
      throw new AlreadyAssignedTaskException();
    }
    return {};
  }
}
