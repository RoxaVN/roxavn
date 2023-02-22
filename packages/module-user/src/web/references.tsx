import { Reference } from '@roxavn/core/web';
import { userApi } from '../base';

export const userReference = new Reference(
  userApi.getMany,
  (item) => item.username
);
