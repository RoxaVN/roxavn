import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { IsNull } from 'typeorm';

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
