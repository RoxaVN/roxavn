import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import {
  ApiService,
  InferAuthApiRequest,
  serviceManager,
} from '@roxavn/core/server';
import dayjs from 'dayjs';
import { In } from 'typeorm';

import { projectApi, roles, scopes } from '../../base';
import { Project, Task } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(projectApi.getOne)
export class GetProjectApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.getOne>) {
    const result = await this.dbSession.getRepository(Project).findOne({
      where: { id: request.projectId },
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
        where: { type: request.type },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(projectApi.getManyJoined)
export class GetJoinedProjectsApiService extends ApiService {
  async handle(request: InferApiRequest<typeof projectApi.getManyJoined>) {
    const page = request.page || 1;
    const pageSize = 10;

    const result = await this.create(
      serviceManager.getUserScopeIdsApiService
    ).handle({
      scope: scopes.Project.name,
      userId: request.userId,
      pageSize,
      page,
    });

    const items = result.items.length
      ? await this.dbSession
          .getRepository(Project)
          .find({ where: { id: In(result.items.map((item) => item.scopeId)) } })
      : [];

    return {
      items: items,
      pagination: result.pagination,
    };
  }
}

@serverModule.useApi(projectApi.create)
export class CreateProjectApiService extends ApiService {
  async handle(request: InferAuthApiRequest<typeof projectApi.create>) {
    const project = new Project();
    project.name = request.name;
    project.type = request.type;
    project.userId = request.$user.id;
    await this.dbSession.save(project);

    // auto set creator as admin
    await this.create(serviceManager.setUserRoleApiService).handle({
      scope: scopes.Project.name,
      scopeId: project.id.toString(),
      roleName: roles.ProjectAdmin.name,
      userId: project.userId,
    });

    const task = new Task();
    task.projectId = project.id;
    task.userId = request.$user.id;
    task.title = request.name;
    task.expiryDate = dayjs().add(request.duration, 'day').toDate();
    await this.dbSession.save(task);

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
