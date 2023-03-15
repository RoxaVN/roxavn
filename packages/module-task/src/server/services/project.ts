import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { projectApi } from '../../base';
import { Project } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(projectApi.getOne)
export class GetProjectApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.getOne>) {
    const result = await this.dbSession.getRepository(Project).findOne({
      where: {
        id: request.id,
      },
    });
    if (result) {
      return result;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(projectApi.getMany)
export class GetProjectsApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.dbSession
      .getRepository(Project)
      .findAndCount({
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(projectApi.create)
export class CreateProjectApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.create>) {
    const project = new Project();
    project.name = request.name;
    project.type = request.type;
    await this.dbSession.save(project);
    return { id: project.id };
  }
}

@serverModule.useApi(projectApi.update)
export class UpdateProjectApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.update>) {
    await this.dbSession.update(
      Project,
      { id: request.projectId },
      { name: request.name, type: request.type }
    );
    return {};
  }
}

@serverModule.useApi(projectApi.delete)
export class DeleteProjectApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.delete>) {
    await this.dbSession.getRepository(Project).delete({
      id: request.projectId,
    });
    return {};
  }
}
