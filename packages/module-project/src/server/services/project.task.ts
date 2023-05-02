import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { In, IsNull } from 'typeorm';

import { projectTaskApi } from '../../base';
import { Task } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(projectTaskApi.getRoot)
export class GetProjectRootTaskApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectTaskApi.getRoot>) {
    const result = await this.dbSession.getRepository(Task).findOne({
      where: {
        projectId: request.projectId,
        parents: IsNull(),
      },
    });
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(projectTaskApi.getSome)
export class GetProjectTasksApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectTaskApi.getSome>) {
    if (request.ids?.length > 0) {
      const items = await this.dbSession.getRepository(Task).find({
        where: {
          projectId: request.projectId,
          id: In(request.ids),
        },
        order: { id: 'ASC' },
      });
      return { items };
    }
    return { items: [] };
  }
}
