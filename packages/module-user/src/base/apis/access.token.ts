import { ApiSource, ExactProps, IsNumberString, Min } from '@roxavn/core/base';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

const accessTokenSource = new ApiSource<{
  id: number;
  userId: number;
  createdDate: Date;
  updatedDate: Date;
  expiredDate: Date;
}>([Resources.AccessToken], baseModule);

class DeleteAccessTokenRequest extends ExactProps<DeleteAccessTokenRequest> {
  @Min(1)
  @IsNumberString()
  public readonly accessTokenId: number;
}

export const accessTokenApi = {
  delete: accessTokenSource.delete({
    validator: DeleteAccessTokenRequest,
    permission: Permissions.DeleteAccessToken,
  }),
};
