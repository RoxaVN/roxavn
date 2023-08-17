import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { eventCrawlerApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Web3EventCrawler } from '../entities/web3.event.crawler.entity.js';

@serverModule.useApi(eventCrawlerApi.getMany)
export class GetEventCrawlersApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof eventCrawlerApi.getMany>) {
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
