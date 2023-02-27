import { ApiSource, ExactProps, MinLength } from '@roxavn/core/base';
import { baseModule } from '../module';
import { permissions, scopes } from '../access';

const accessTokenSource = new ApiSource<{
  id: string;
  userId: string;
  createdDate: Date;
  updatedDate: Date;
  expiredDate: Date;
}>([scopes.AccessToken], baseModule);

class DeleteAccessTokenRequest extends ExactProps<DeleteAccessTokenRequest> {
  @MinLength(1)
  public readonly accessTokenId: string;
}

export const accessTokenApi = {
  delete: accessTokenSource.delete({
    validator: DeleteAccessTokenRequest,
    permission: permissions.DeleteAccessToken,
  }),
};
