import { Reference } from '@roxavn/core/web';
import { userApi } from '../base';

export const userReference = new Reference().update(
  userApi.search,
  (item) => item.username
);
