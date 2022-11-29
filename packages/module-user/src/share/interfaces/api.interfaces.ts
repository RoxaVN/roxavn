import {
  ExactProps,
  Id,
  IsEmail,
  MinLength,
  PaginatedCollection,
} from '@roxavn/core/share';
import { Module } from './module.interfaces';
import { Role } from './role.interfaces';
import { User } from './user.interfaces';

export class LoginRequest extends ExactProps<LoginRequest> {
  @IsEmail()
  public readonly email!: string;

  @MinLength(1)
  public readonly password!: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse extends Id {
  resetPasswordToken?: string;
}

export interface GetUsersRequest {
  name?: string;
  page?: number;
}

export type GetUsersResponse = PaginatedCollection<User>;

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}

export interface GetRolesRequest {
  escapedModuleName?: string;
}

export interface GetRolesResponse {
  items: Role[];
}

export interface GetMeModulesResponse {
  items: Module[];
}

export interface GetUserModulesResponse {
  items: Module[];
}

export interface SetModuleRolesToUserRequest {
  items: { escapedModuleName: string; roleId: number | null }[];
}
