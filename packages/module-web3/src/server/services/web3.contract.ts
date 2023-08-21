import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { web3ContractApi } from '../../base/index.js';
import { Web3Contract } from '../entities/index.js';
import { serverModule } from '../module.js';

@serverModule.injectable()
export class GetWeb3ContractApiService extends InjectDatabaseService {
  async handle(request: { web3contractId: string }) {
    const item = await this.entityManager.getRepository(Web3Contract).findOne({
      where: { id: request.web3contractId },
    });

    if (item) {
      return item;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(web3ContractApi.create)
export class CreateWeb3ContractApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3ContractApi.create>) {
    const item = new Web3Contract();
    Object.assign(item, request);

    await this.entityManager.save(item);
    return { id: item.id };
  }
}

@serverModule.useApi(web3ContractApi.update)
export class UpdateWeb3ContractApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3ContractApi.update>) {
    await this.entityManager.getRepository(Web3Contract).update(
      { id: request.web3ContractId },
      {
        address: request.address,
        abi: request.abi,
        networkId: request.networkId?.toString(),
      }
    );
    return {};
  }
}

@serverModule.useApi(web3ContractApi.getMany)
export class GetWeb3ContractsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3ContractApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Web3Contract)
      .findAndCount({
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}
