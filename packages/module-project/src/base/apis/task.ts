import {
  ApiSource,
  ExactProps,
  MaxLength,
  Min,
  MinLength,
  TransformDate,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';

export interface TaskResponse {
  id: number;
  userId: string;
  assignee?: string;
  parents?: number[];
  childrenCount: number;
  progress: number;
  weight: number;
  status: string;
  title: string;
  projectId: number;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
  expiryDate: Date;
  startedDate?: Date;
  finishedDate?: Date;
  rejectedDate?: Date;
}

const taskSource = new ApiSource<TaskResponse>([scopes.Task], baseModule);

class CreateSubTaskRequest extends ExactProps<CreateSubTaskRequest> {
  @Min(1)
  public readonly taskId!: number;

  @MinLength(1)
  @MaxLength(2048)
  public readonly title!: string;

  @TransformDate()
  public readonly expiryDate!: Date;
}

export const taskApi = {
  createSub: taskSource.create<CreateSubTaskRequest, { id: number }>({
    path: taskSource.apiPath({ includeId: true }) + '/sub',
    validator: CreateSubTaskRequest,
    permission: permissions.CreateTask,
  }),
};
