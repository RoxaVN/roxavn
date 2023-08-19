import {
  ApiSource,
  ExactProps,
  IsNotEmptyObject,
  IsOptional,
  Min,
  MinLength,
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

  @IsNotEmptyObject()
  public readonly abi: Record<string, any>;
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

  @IsNotEmptyObject()
  @IsOptional()
  public readonly abi?: Record<string, any>;
}

export const web3ContractApi = {
  update: web3ContractSource.update({
    validator: UpdateWeb3ContractRequest,
    permission: permissions.UpdateWeb3Contract,
  }),
  create: web3ContractSource.create({
    validator: CreateWeb3ContractRequest,
    permission: permissions.CreateWeb3Contract,
  }),
};
