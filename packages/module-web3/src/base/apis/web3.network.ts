import {
  ApiSource,
  ExactProps,
  IsOptional,
  IsUrl,
  Max,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const web3NetworkSource = new ApiSource<{
  id: string;
  providerUrl: string;
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

class UpdateWeb3NetworkRequest extends ExactProps<UpdateWeb3NetworkRequest> {
  @MinLength(1)
  public readonly web3NetworkId: string;

  @IsUrl()
  public readonly providerUrl: string;
}

class CreateWeb3NetworkRequest extends ExactProps<CreateWeb3NetworkRequest> {
  @Min(1)
  public readonly id: number;

  @IsUrl()
  public readonly providerUrl: string;
}

export const web3NetworkApi = {
  create: web3NetworkSource.create({
    validator: CreateWeb3NetworkRequest,
    permission: permissions.CreateWeb3Network,
  }),
  update: web3NetworkSource.update({
    validator: UpdateWeb3NetworkRequest,
    permission: permissions.UpdateWeb3Network,
  }),
  getMany: web3NetworkSource.getMany({
    validator: GetWeb3NetworksRequest,
    permission: permissions.ReadWeb3Networks,
  }),
};