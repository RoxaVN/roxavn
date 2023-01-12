import { Api, Empty, NotFoundException } from '@roxavn/core/share';
import { UserResponse } from '../interfaces';
import { baseModule } from '../module';

export const getMyUserApi: Api<Empty, UserResponse, NotFoundException> =
  baseModule.api({
    method: 'GET',
    path: '/user/me',
  });
