import { Api, Empty, UnauthorizedException } from '@roxavn/core/share';
import { UserInfoResponse } from '../interfaces';

import { baseModule } from '../module';

class GetMyUserInfoRequest {}

type GetMyUserInfoResponse = UserInfoResponse | Empty;

export const getMyUserInfoApi: Api<
  GetMyUserInfoRequest,
  GetMyUserInfoResponse,
  UnauthorizedException
> = baseModule.api({
  method: 'GET',
  path: '/user-info/me',
});
