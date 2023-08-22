import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { web3EventApi } from '../../base/index.js';
import { Web3Event } from '../entities/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(web3EventApi.getMany)
export class GetWeb3EventsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3EventApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Web3Event)
      .findAndCount({
        take: pageSize,
        skip: (page - 1) * pageSize,
        order: { blockNumber: 'DESC' },
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}
