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

const web3EventConsumerSource = new ApiSource<{
  id: string;
  name: string;
  lastConsumeBlockNumber: string;
  crawlerId: string;
  metadata?: Record<string, any>;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.Web3EventConsumer], baseModule);

class GetWeb3EventConsumersRequest extends ExactProps<GetWeb3EventConsumersRequest> {
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

export const web3EventConsumerApi = {
  getMany: web3EventConsumerSource.getMany({
    validator: GetWeb3EventConsumersRequest,
    permission: permissions.ReadWeb3EventConsumers,
  }),
};
