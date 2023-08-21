import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const web3ContractSource = new ApiSource<{
  id: string;
  address: string;
  abi: Record<string, any>;
  networkId: string;
  metadata?: Record<string, any>;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.Web3Contract], baseModule);

class CreateWeb3ContractRequest extends ExactProps<CreateWeb3ContractRequest> {
  @MinLength(1)
  public readonly address: string;

  @Min(1)
  public readonly networkId: number;

  public readonly abi: any;
}

class UpdateWeb3ContractRequest extends ExactProps<UpdateWeb3ContractRequest> {
  @MinLength(1)
  public readonly web3ContractId: string;

  @MinLength(1)
  @IsOptional()
  public readonly address?: string;

  @Min(1)
  @IsOptional()
  public readonly networkId?: number;

  @IsOptional()
  public readonly abi?: any;
}

class GetWeb3ContractsRequest extends ExactProps<GetWeb3ContractsRequest> {
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

export const web3ContractApi = {
  getMany: web3ContractSource.getMany({
    validator: GetWeb3ContractsRequest,
    permission: permissions.ReadWeb3Contracts,
  }),
  update: web3ContractSource.update({
    validator: UpdateWeb3ContractRequest,
    permission: permissions.UpdateWeb3Contract,
  }),
  create: web3ContractSource.create({
    validator: CreateWeb3ContractRequest,
    permission: permissions.CreateWeb3Contract,
  }),
};
