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

const eventCrawlerSource = new ApiSource<{
  id: string;
  event: string;
  contractAddress: string;
  networkId: string;
  provider: string;
  lastBlock: string;
  delayBlock: number;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.EventCrawler], baseModule);

class GetEventCrawlersRequest extends ExactProps<GetEventCrawlersRequest> {
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

export const eventCrawlerApi = {
  getMany: eventCrawlerSource.getMany({
    validator: GetEventCrawlersRequest,
    permission: permissions.ReadEventCrawlers,
  }),
};
