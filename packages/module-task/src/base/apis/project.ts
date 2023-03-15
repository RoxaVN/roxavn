import {
  ApiSource,
  ArrayMaxSize,
  ArrayMinSize,
  ExactProps,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';
import { constants } from '../constants';

const projectSource = new ApiSource<{
  id: string;
  type: string;
  name: string;
  createdDate: Date;
}>([scopes.Project], baseModule);

class GetProjectRequest extends ExactProps<GetProjectRequest> {
  @MinLength(1)
  public readonly id!: string;
}

class GetProjectsRequest extends ExactProps<GetProjectsRequest> {
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

class CreateProjectRequest extends ExactProps<CreateProjectRequest> {
  @MinLength(1)
  public readonly name!: string;

  @IsIn(Object.values(constants.ProjectTypes))
  public readonly type!: string;
}

class UpdateProjectRequest extends ExactProps<UpdateProjectRequest> {
  @MinLength(1)
  public readonly projectId!: string;

  @MinLength(1)
  @IsOptional()
  public readonly name?: string;

  @IsIn(Object.values(constants.ProjectTypes))
  @IsOptional()
  public readonly type?: string;
}

class DeleteProjectRequest extends ExactProps<DeleteProjectRequest> {
  @MinLength(1)
  public readonly projectId!: string;
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
  create: projectSource.create({
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
