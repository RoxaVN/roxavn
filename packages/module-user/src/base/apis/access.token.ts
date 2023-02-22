import { ApiSource, ExactProps, MinLength } from '@roxavn/core/base';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

const accessTokenSource = new ApiSource<{
  id: string;
  userId: string;
  createdDate: Date;
  updatedDate: Date;
  expiredDate: Date;
}>([Resources.AccessToken], baseModule);

class DeleteAccessTokenRequest extends ExactProps<DeleteAccessTokenRequest> {
  @MinLength(1)
  public readonly accessTokenId: string;
}

export const accessTokenApi = {
  delete: accessTokenSource.delete({
    validator: DeleteAccessTokenRequest,
    permission: Permissions.DeleteAccessToken,
  }),
};
