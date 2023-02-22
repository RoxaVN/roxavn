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
} from '@roxavn/core/base';
import { Type } from 'class-transformer';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';
import { IsUsername } from '../validation';

const userSource = new ApiSource<{
  id: string;
  username: string;
  email?: string;
  phone?: string;
  createdDate: Date;
  updatedDate: Date;
}>([Resources.User], baseModule);

class GetUsersRequest extends ExactProps<GetUsersRequest> {
  @IsOptional()
  public readonly username?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDateString({}, { each: true })
  @IsOptional()
  public readonly createdDate?: Date[];

  @Min(1)
  @Type(() => Number)
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
    permission: Permissions.ReadUsers,
  }),
  getOne: userSource.getOne({
    validator: GetUserRequest,
    permission: Permissions.ReadUser,
  }),
  create: userSource.create({
    validator: CreateUserRequest,
    permission: Permissions.CreateUser,
  }),
};
