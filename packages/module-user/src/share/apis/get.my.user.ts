import { Api, Empty, NotFoundException } from '@roxavn/core/share';
import { User } from '../interfaces';

export const GetMyUserApi: Api<Empty, User, NotFoundException> = {
  method: 'GET',
  path: '/user/me',
};
