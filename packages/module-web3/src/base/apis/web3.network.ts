import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { scopes } from '../access.js';

const web3NetworkSource = new ApiSource<{
  id: string;
  provider: string;
  metadata?: Record<string, any>;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.Web3Network], baseModule);

class GetWeb3NetworksRequest extends ExactProps<GetWeb3NetworksRequest> {
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

export const web3NetworkApi = {
  getMany: web3NetworkSource.getMany({
    validator: GetWeb3NetworksRequest,
  }),
};
