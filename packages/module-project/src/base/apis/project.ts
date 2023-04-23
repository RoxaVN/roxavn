import {
  ApiSource,
  ArrayMaxSize,
  ArrayMinSize,
  ExactProps,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  MaxLength,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';
import { constants } from '../constants';

export interface ProjectResponse {
  id: number;
  type: string;
  name: string;
  userId: string;
  createdDate: Date;
}

const projectSource = new ApiSource<ProjectResponse>(
  [scopes.Project],
  baseModule
);

class GetProjectRequest extends ExactProps<GetProjectRequest> {
  @MinLength(1)
  public readonly projectId!: number;
}

class GetProjectsRequest extends ExactProps<GetProjectsRequest> {
  @IsOptional()
  public readonly type?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDateString({}, { each: true })
  @IsOptional()
  public readonly createdDate?: Date[];

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page = 1;
}

class GetJoinedProjectsRequest extends ExactProps<GetJoinedProjectsRequest> {
  @MinLength(1)
  public readonly userId!: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;
}

class CreateProjectRequest extends ExactProps<CreateProjectRequest> {
  @MinLength(1)
  @MaxLength(1024)
  public readonly name!: string;

  @IsIn(Object.values(constants.ProjectTypes))
  public readonly type!: string;

  @Min(1)
  public readonly duration!: number;
}

class UpdateProjectRequest extends ExactProps<UpdateProjectRequest> {
  @MinLength(1)
  public readonly projectId!: string;

  @MaxLength(1024)
  @MinLength(1)
  @IsOptional()
  public readonly name?: string;

  @IsIn(Object.values(constants.ProjectTypes))
  @IsOptional()
  public readonly type?: string;
}

class DeleteProjectRequest extends ExactProps<DeleteProjectRequest> {
  @MinLength(1)
  public readonly projectId!: number;
}

export const projectApi = {
  getOne: projectSource.getOne({
    validator: GetProjectRequest,
    permission: permissions.ReadProject,
  }),
  getMany: projectSource.getMany({
    validator: GetProjectsRequest,
    permission: permissions.ReadProjects,
  }),
  getManyJoined: projectSource.getMany({
    path: baseModule.apiPath('/joined-projects'),
    validator: GetJoinedProjectsRequest,
    permission: permissions.ReadProjects,
  }),
  create: projectSource.create<CreateProjectRequest, { id: number }>({
    validator: CreateProjectRequest,
    permission: permissions.CreateProject,
  }),
  update: projectSource.update({
    validator: UpdateProjectRequest,
    permission: permissions.UpdateProject,
  }),
  delete: projectSource.delete({
    validator: DeleteProjectRequest,
    permission: permissions.DeleteProject,
  }),
};
