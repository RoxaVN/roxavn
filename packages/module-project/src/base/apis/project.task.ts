import { ApiSource, ExactProps, Min, TransformNumber } from '@roxavn/core/base';

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

export const projectTaskApi = {
  getRoot: projectTaskSource.getOne({
    path: projectTaskSource.apiPath({ includeId: true }) + '/root-task',
    validator: GetProjectRootTaskRequest,
    permission: permissions.ReadProject,
  }),
};
