import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const web3EventSource = new ApiSource<{
  id: string;
  event: string;
  contractAddress: string;
  networkId: string;
  blockNumber: string;
  blockHash: string;
  transactionIndex?: string;
  logIndex?: string;
  signature: string;
  data: Record<string, any>;
  createdDate: Date;
}>([scopes.Web3Event], baseModule);

class GetWeb3EventsRequest extends ExactProps<GetWeb3EventsRequest> {
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

export const web3EventApi = {
  getMany: web3EventSource.getMany({
    validator: GetWeb3EventsRequest,
    permission: permissions.ReadWeb3Events,
  }),
};
