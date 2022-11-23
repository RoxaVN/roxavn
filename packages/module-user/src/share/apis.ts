import {
  Api,
  BadRequestException,
  Empty,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@roxavn/core/share';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetMeModulesResponse,
  GetRolesRequest,
  GetRolesResponse,
  GetUserModulesResponse,
  GetUsersRequest,
  GetUsersResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SetModuleRolesToUserRequest,
} from './interfaces/api.interfaces';
import { UserExistsException } from './interfaces/error.interfaces';
import { User } from './interfaces/user.interfaces';
import { Permissions } from './permissions';

export const Apis = {
  Login: {
    method: 'POST',
    path: '/login',
  } as Api<LoginRequest, LoginResponse, UnauthorizedException>,

  Logout: {
    method: 'POST',
    path: '/logout',
  } as Api<Empty, Empty, UnauthorizedException>,

  ResetPassword: {
    method: 'POST',
    path: '/reset-password',
  } as Api<
    ResetPasswordRequest,
    Empty,
    BadRequestException | UnauthorizedException | ForbiddenException
  >,

  CreateUser: {
    method: 'POST',
    path: '/users',
    permission: Permissions.CreateUser,
  } as Api<
    CreateUserRequest,
    CreateUserResponse,
    UnauthorizedException | ForbiddenException | UserExistsException
  >,

  GetUsers: {
    method: 'GET',
    path: '/users',
    permission: Permissions.ReadUser,
  } as Api<
    GetUsersRequest,
    GetUsersResponse,
    UnauthorizedException | ForbiddenException
  >,

  GetUserById: {
    method: 'GET',
    path: '/users/:id',
    permission: Permissions.ReadUser,
  } as Api<Empty, User, NotFoundException>,

  GetMeUser: {
    method: 'GET',
    path: '/users/me',
  } as Api<Empty, User, NotFoundException>,

  SetModuleRolesToUser: {
    method: 'PUT',
    path: '/users/:id/module-roles',
    permission: Permissions.ManageUserModuleRoles,
  } as Api<SetModuleRolesToUserRequest, Empty, BadRequestException>,

  GetRoles: {
    method: 'GET',
    path: '/roles',
  } as Api<GetRolesRequest, GetRolesResponse, UnauthorizedException>,

  GetMeModules: {
    method: 'GET',
    path: '/users/me/modules',
  } as Api<Empty, GetMeModulesResponse, UnauthorizedException>,

  GetUserModules: {
    method: 'GET',
    path: '/users/:id/modules',
    permission: Permissions.ReadUser,
  } as Api<
    Empty,
    GetUserModulesResponse,
    UnauthorizedException | ForbiddenException
  >,
};
