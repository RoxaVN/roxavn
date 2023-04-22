import {
  ApiSource,
  ExactProps,
  IsOptional,
  MaxLength,
  Min,
  MinLength,
  TransformDate,
  TransformNumber,
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

class CreateSubtaskRequest extends ExactProps<CreateSubtaskRequest> {
  @Min(1)
  public readonly taskId!: number;

  @MinLength(1)
  @MaxLength(2048)
  public readonly title!: string;

  @TransformDate()
  public readonly expiryDate!: Date;
}

class GetSubtasksRequest extends ExactProps<GetSubtasksRequest> {
  @Min(1)
  public readonly taskId!: number;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;
}

class GetTaskRequest extends ExactProps<GetTaskRequest> {
  @Min(1)
  public readonly taskId!: number;
}

class DeleteTaskRequest extends ExactProps<DeleteTaskRequest> {
  @Min(1)
  public readonly taskId!: number;
}

export const taskApi = {
  createSubtask: taskSource.create<CreateSubtaskRequest, { id: number }>({
    path: taskSource.apiPath({ includeId: true }) + '/subtasks',
    validator: CreateSubtaskRequest,
    permission: permissions.CreateTask,
  }),
  getSubtasks: taskSource.getMany({
    path: taskSource.apiPath({ includeId: true }) + '/subtasks',
    validator: GetSubtasksRequest,
    permission: permissions.ReadTasks,
  }),
  getOne: taskSource.getOne({
    validator: GetTaskRequest,
    permission: permissions.ReadTask,
  }),
  delete: taskSource.delete({
    validator: DeleteTaskRequest,
    permission: permissions.DeleteTask,
  }),
};
