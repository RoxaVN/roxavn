import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { web3EventCrawlerApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Web3EventCrawler } from '../entities/index.js';

@serverModule.useApi(web3EventCrawlerApi.getMany)
export class GetWeb3EventCrawlersApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3EventCrawlerApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Web3EventCrawler)
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

@serverModule.useApi(web3EventCrawlerApi.update)
export class updateWeb3EventCrawlersApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3EventCrawlerApi.update>) {
    await this.entityManager
      .getRepository(Web3EventCrawler)
      .update(
        { id: request.web3EventCrawlerId },
        { isActive: request.isActive }
      );
    return {};
  }
}

@serverModule.useApi(web3EventCrawlerApi.create)
export class CreateWeb3EventCrawlerApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof web3EventCrawlerApi.create>) {
    const item = new Web3EventCrawler();
    Object.assign(item, request);

    await this.entityManager.getRepository(Web3EventCrawler).insert(item);
    return { id: item.id };
  }
}
