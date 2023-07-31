import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  MinLength,
  TransformArray,
  TransformNumber,
} from '@roxavn/core/base';

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
    value: any;
  }>;
}>([scopes.Store, scopes.Asset], baseModule);

class GetStoreAssetsRequest extends ExactProps<GetStoreAssetsRequest> {
  @MinLength(1)
  public readonly storeId!: string;

  @TransformArray()
  @IsOptional()
  public readonly attributeIds?: string[];

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;

  @Min(1)
  @Max(100)
  @TransformNumber()
  @IsOptional()
  public readonly pageSize?: number;
}

export const storeAssetApi = {
  getMany: storeAssetSource.getMany({
    validator: GetStoreAssetsRequest,
    permission: permissions.ReadStoreAssets,
  }),
};
