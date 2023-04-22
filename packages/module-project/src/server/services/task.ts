import { NotFoundException } from '@roxavn/core/base';
import { ApiService, InferAuthApiRequest } from '@roxavn/core/server';

import { InvalidExpiryDateException, taskApi } from '../../base';
import { Task } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(taskApi.createSub)
export class CreateSubTaskApiService extends ApiService {
  async handle(request: InferAuthApiRequest<typeof taskApi.createSub>) {
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
    subTask.parents = [...(task.parents || []), task.id];
    await this.dbSession.save(subTask);

    await this.dbSession
      .getRepository(Task)
      .increment({ id: request.taskId }, 'childrenCount', 1);

    return { id: subTask.id };
  }
}
