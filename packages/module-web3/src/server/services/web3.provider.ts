import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { web3ProviderApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Web3Provider } from '../entities/index.js';

@serverModule.injectable()
export class GetWeb3ProviderApiService extends InjectDatabaseService {
  async handle(request: { web3ProviderId: string }) {
    const item = await this.entityManager.getRepository(Web3Provider).findOne({
      where: { id: request.web3ProviderId },
    });

    if (item) {
      return item;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(web3ProviderApi.getMany)
export class GetWeb3ProvidersApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3ProviderApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Web3Provider)
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

@serverModule.useApi(web3ProviderApi.update)
export class UpdateWeb3ProviderApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3ProviderApi.update>) {
    await this.entityManager.getRepository(Web3Provider).update(
      { id: request.web3ProviderId },
      {
        networkId: request.networkId.toString(),
        url: request.url,
        delayBlockCount: request.delayBlockCount,
        blockRangePerCrawl: request.blockRangePerCrawl,
      }
    );
    return {};
  }
}

@serverModule.useApi(web3ProviderApi.create)
export class CreateWeb3ProviderApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3ProviderApi.create>) {
    const item = new Web3Provider();
    Object.assign(item, request);

    await this.entityManager.getRepository(Web3Provider).insert(item);
    return { id: item.id };
  }
}
