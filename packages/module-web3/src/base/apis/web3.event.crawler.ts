import {
  ApiSource,
  ExactProps,
  IsBoolean,
  IsOptional,
  Max,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const web3EventCrawlerSource = new ApiSource<{
  id: string;
  event: string;
  contractId: string;
  isActive: boolean;
  lastBlockNumber: string;
  delayBlock: number;
  blockRange: number;
  metadata?: any;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.Web3EventCrawler], baseModule);

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

class UpdateEventCrawlersRequest extends ExactProps<UpdateEventCrawlersRequest> {
  @MinLength(1)
  public readonly web3EventCrawlerId: string;

  @IsBoolean()
  @IsOptional()
  public readonly isActive?: boolean;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly delayBlock?: number;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly blockRange?: number;
}

class CreateWeb3EventCrawlerRequest extends ExactProps<CreateWeb3EventCrawlerRequest> {
  @MinLength(1)
  public readonly event: string;

  @MinLength(1)
  public readonly contractId: string;

  @Min(1)
  public readonly lastBlockNumber: number;
}

export const web3EventCrawlerApi = {
  create: web3EventCrawlerSource.create({
    validator: CreateWeb3EventCrawlerRequest,
    permission: permissions.CreateWeb3EventCrawler,
  }),
  getMany: web3EventCrawlerSource.getMany({
    validator: GetEventCrawlersRequest,
    permission: permissions.ReadWeb3EventCrawlers,
  }),
  update: web3EventCrawlerSource.update({
    validator: UpdateEventCrawlersRequest,
    permission: permissions.UpdateWeb3EventCrawler,
  }),
};
