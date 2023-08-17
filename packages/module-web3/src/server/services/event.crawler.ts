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

@serverModule.useApi(eventCrawlerApi.update)
export class updateEventCrawlersApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof eventCrawlerApi.update>) {
    await this.entityManager
      .getRepository(Web3EventCrawler)
      .update(
        { id: request.eventCrawlerId },
        { provider: request.provider, delayBlock: request.delayBlock }
      );
    return {};
  }
}

export class CreateEventCrawlersApiService extends InjectDatabaseService {
  async handle(request: {
    event: string;
    contractAddress: string;
    networkId: number;
    provider: string;
    birthBlockNumber: number;
  }) {
    const eventCrawler = new Web3EventCrawler();
    eventCrawler.event = request.event;
    eventCrawler.contractAddress = request.contractAddress;
    eventCrawler.networkId = request.networkId.toString();
    eventCrawler.provider = request.provider;
    eventCrawler.lastBlockNumber = request.birthBlockNumber.toString();

    await this.entityManager.save(eventCrawler);
    return { id: eventCrawler.id };
  }
}
