import { BaseService, DatabaseService, inject } from '@roxavn/core/server';
import Web3, { Contract } from 'web3';
import type { EventLog } from 'web3-eth-contract';

import {
  Web3Contract,
  Web3Event,
  Web3EventCrawler,
  Web3Provider,
} from '../entities/index.js';
import { serverModule } from '../module.js';
import { GetWeb3ContractApiService } from './web3.contract.js';
import { NotFoundProviderException } from '../../base/index.js';

@serverModule.useCronJob('* * * * *')
export class Web3EventCrawlersCronService extends BaseService {
  constructor(
    @inject(DatabaseService)
    protected databaseService: DatabaseService,
    @inject(GetWeb3ContractApiService)
    protected getWeb3ContractApiService: GetWeb3ContractApiService
  ) {
    super();
  }

  async handle() {
    const crawlers = await this.databaseService.manager
      .getRepository(Web3EventCrawler)
      .find({
        where: { isActive: true },
      });
    const contracts: Record<
      string,
      { service: Contract<any>; entity: Web3Contract }
    > = {};
    type ProviderItem = {
      service: Web3;
      entity: Web3Provider;
      lastBlockNumber: bigint;
    };
    const providers: Record<string, ProviderItem> = {};
    const eventLogs: { log: EventLog; network: string; crawler: string }[] = [];

    for (const crawler of crawlers) {
      let contract = contracts[crawler.contractId];
      let provider: ProviderItem;
      if (!contract) {
        const contractEntity = await this.getWeb3ContractApiService.handle({
          web3contractId: crawler.contractId,
        });
        provider = providers[contractEntity.networkId];
        if (!provider) {
          const providerEntity = await this.databaseService.manager
            .getRepository(Web3Provider)
            .findOne({
              where: { networkId: contractEntity.networkId },
            });
          if (!providerEntity) {
            throw new NotFoundProviderException(contractEntity.networkId);
          }
          const web3 = new Web3(
            new Web3.providers.HttpProvider(providerEntity.url)
          );
          const lastBlockNumber = await web3.eth.getBlockNumber();
          provider = {
            service: web3,
            entity: providerEntity,
            lastBlockNumber:
              lastBlockNumber - BigInt(providerEntity.delayBlockCount),
          };
          providers[contractEntity.networkId] = provider;
        }
        contract = {
          service: new provider.service.eth.Contract(
            contractEntity.abi as any,
            contractEntity.address
          ),
          entity: contractEntity,
        };
        contracts[crawler.contractId] = contract;
      } else {
        provider = providers[contract.entity.networkId];
      }

      const fromBlock = BigInt(crawler.lastCrawlBlockNumber);
      let toBlock = fromBlock + BigInt(provider.entity.blockRangePerCrawl);
      toBlock =
        toBlock > provider.lastBlockNumber ? provider.lastBlockNumber : toBlock;
      const events = (await contract.service.getPastEvents(crawler.event, {
        fromBlock: fromBlock,
        toBlock: toBlock,
      })) as EventLog[];

      eventLogs.push(
        ...events.map((e) => ({
          log: e,
          network: contract.entity.networkId,
          crawler: crawler.id,
        }))
      );

      // update lastCrawlBlockNumber
      crawler.lastCrawlBlockNumber = toBlock.toString();
    }

    await this.databaseService.manager
      .createQueryBuilder()
      .insert()
      .into(Web3Event)
      .values(
        eventLogs.map(({ log, network, crawler }) => {
          const data: any = {};
          for (const key in log.returnValues) {
            if (key !== '__length__' && Number.isNaN(parseInt(key))) {
              const value = log.returnValues[key];
              data[key] = typeof value === 'bigint' ? value.toString() : value;
            }
          }
          return {
            id: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber?.toString(),
            contractAddress: log.address,
            event: log.event,
            signature: log.signature,
            transactionIndex: log.transactionIndex?.toString(),
            logIndex: log.logIndex?.toString(),
            data: data,
            networkId: network,
            crawlerId: crawler,
          };
        })
      )
      .orIgnore()
      .execute();

    // save crawlers
    await this.databaseService.manager.save(crawlers);

    return {};
  }
}
