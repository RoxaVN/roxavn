import { ApiSource, ExactProps, IsNumberString } from '@roxavn/core/base';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

const userAccessTokenSource = new ApiSource<{
  id: number;
  userId: number;
  createdDate: Date;
  updatedDate: Date;
  expiredDate: Date;
}>([Resources.User, Resources.AccessToken], baseModule);

class GetUserAccessTokensRequest extends ExactProps<GetUserAccessTokensRequest> {
  @IsNumberString({})
  public readonly userId: number;
}

export const userAccessTokenApi = {
  getMany: userAccessTokenSource.getMany({
    validator: GetUserAccessTokensRequest,
    permission: Permissions.GetUserAccessTokens,
  }),
};
