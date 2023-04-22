import {
  ApiSource,
  ArrayMaxSize,
  ExactProps,
  Min,
  TransformArray,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';
import { TaskResponse } from './task';

const projectTaskSource = new ApiSource<TaskResponse>(
  [scopes.Project],
  baseModule
);

class GetProjectRootTaskRequest extends ExactProps<GetProjectRootTaskRequest> {
  @Min(1)
  @TransformNumber()
  public readonly projectId!: number;
}

class GetProjectRootTasksRequest extends ExactProps<GetProjectRootTasksRequest> {
  @Min(1)
  @TransformNumber()
  public readonly projectId: number;

  @Min(1, { each: true })
  @ArrayMaxSize(20)
  @TransformArray(Number)
  public readonly ids: number[];
}

export const projectTaskApi = {
  getRoot: projectTaskSource.getOne({
    path: projectTaskSource.apiPath({ includeId: true }) + '/root-task',
    validator: GetProjectRootTaskRequest,
    permission: permissions.ReadProject,
  }),
  getSome: projectTaskSource.getAll({
    path: projectTaskSource.apiPath({ includeId: true }) + '/tasks',
    validator: GetProjectRootTasksRequest,
    permission: permissions.ReadTasks,
  }),
};
