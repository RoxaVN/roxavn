import {
  ApiSource,
  ArrayMaxSize,
  ArrayMinSize,
  ExactProps,
  IsArray,
  IsDateString,
  IsOptional,
  MaxLength,
  Min,
  MinLength,
  TransformArray,
  TransformNumber,
} from '@roxavn/core/base';
import { baseModule } from '../module';
import { permissions, scopes } from '../access';
import { IsUsername } from '../validation';

const userSource = new ApiSource<{
  id: string;
  username: string;
  email?: string;
  phone?: string;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.User], baseModule);

class GetUsersRequest extends ExactProps<GetUsersRequest> {
  @IsOptional()
  public readonly username?: string;

  @MinLength(1, { each: true })
  @IsOptional()
  @TransformArray()
  public readonly ids?: string[];

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

class GetUserRequest extends ExactProps<GetUserRequest> {
  @MinLength(1)
  public readonly userId: string;
}

class CreateUserRequest extends ExactProps<CreateUserRequest> {
  @IsUsername()
  @MinLength(6)
  @MaxLength(32)
  public readonly username!: string;
}

export const userApi = {
  getMany: userSource.getMany({
    validator: GetUsersRequest,
    permission: permissions.ReadUsers,
  }),
  getOne: userSource.getOne({
    validator: GetUserRequest,
    permission: permissions.ReadUser,
  }),
  create: userSource.create({
    validator: CreateUserRequest,
    permission: permissions.CreateUser,
  }),
};
