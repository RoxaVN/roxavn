import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { web3NetworkApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Web3Network } from '../entities/index.js';

@serverModule.useApi(web3NetworkApi.getMany)
export class GetWeb3NetworksApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3NetworkApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Web3Network)
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

@serverModule.useApi(web3NetworkApi.update)
export class UpdateWeb3NetworkApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3NetworkApi.update>) {
    await this.entityManager
      .getRepository(Web3Network)
      .update(
        { id: request.web3NetworkId },
        { providerUrl: request.providerUrl }
      );
    return {};
  }
}
