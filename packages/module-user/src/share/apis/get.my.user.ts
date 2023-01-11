import { Api, Empty, NotFoundException } from '@roxavn/core/share';
import { User } from '../interfaces';
import { baseModule } from '../module';

export const getMyUserApi: Api<Empty, User, NotFoundException> = baseModule.api(
  {
    method: 'GET',
    path: '/user/me',
  }
);
