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
  id: string;
  userId: string;
  assignee?: string;
  parents?: string[];
  parentId?: string;
  childrenCount: number;
  progress: number;
  weight: number;
  status: string;
  title: string;
  projectId: string;
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
  @MinLength(1)
  public readonly taskId!: string;

  @MinLength(1)
  @MaxLength(2048)
  public readonly title!: string;

  @TransformDate()
  public readonly expiryDate!: Date;
}

class GetSubtasksRequest extends ExactProps<GetSubtasksRequest> {
  @MinLength(1)
  public readonly taskId!: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;
}

class GetTaskRequest extends ExactProps<GetTaskRequest> {
  @MinLength(1)
  public readonly taskId!: string;
}

class DeleteTaskRequest extends ExactProps<DeleteTaskRequest> {
  @MinLength(1)
  public readonly taskId!: string;
}

export const taskApi = {
  createSubtask: taskSource.create({
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
