import { ApiSource, ExactProps, Min, TransformNumber } from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';

export interface TaskResponse {
  id: number;
  userId: string;
  assignee?: string;
  parents?: string[];
  childrenCount: number;
  progress: number;
  weight: number;
  status: string;
  title: string;
  content?: string;
  projectId: number;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
  expiryDate: Date;
  startedDate?: Date;
  finishedDate?: Date;
  rejectedDate?: Date;
}

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
