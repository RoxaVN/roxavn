import { ApiSource, ExactProps, MinLength } from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const storeAssetSource = new ApiSource<{
  id: string;
  userId: string;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
  storeId: string;
  assetAttributes: Array<{
    id: string;
    name: string;
  }>;
}>([scopes.Store], baseModule);

class GetStoreAssetsRequest extends ExactProps<GetStoreAssetsRequest> {
  @MinLength(1)
  public readonly storeId!: string;
}

export const storeAssetApi = {
  getMany: storeAssetSource.getMany({
    validator: GetStoreAssetsRequest,
    permission: permissions.ReadStoreAssets,
  }),
};
