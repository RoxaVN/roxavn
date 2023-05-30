import { DataSource, EntityManager } from 'typeorm';
import { inject } from 'inversify';

import { constants } from '../../base/index.js';
import { moduleManager } from '../module.manager.js';
import { MemoryQueryResultCache } from './cache.js';
import { autoBind, BaseService, bindFactory } from '../services/base.js';

export class DatabaseService {
  manager: EntityManager;

  constructor(public dataSource: DataSource, private entities: any[]) {
    this.manager = dataSource.manager;
  }

  getEntity(name: string) {
    const capitalName = name[0].toUpperCase() + name.slice(1);
    return this.entities.find((e) => e.name === capitalName);
  }

  @bindFactory()
  static async create() {
    const isDev = process.env.NODE_ENV === constants.ENV_DEVELOPMENT;
    const entities = moduleManager.serverModules.map((m) => m.entities).flat();

    const dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: entities,
      logging: isDev ? true : false,
      synchronize: isDev ? true : false,
      cache: {
        duration: constants.QUERY_CACHE_DURATION,
        provider() {
          return new MemoryQueryResultCache();
        },
      },
    });
    await dataSource.initialize();

    return new DatabaseService(dataSource, entities);
  }
}

@autoBind()
export abstract class InjectDatabaseService extends BaseService {
  entityManager: EntityManager;

  constructor(
    @inject(DatabaseService) protected databaseService: DatabaseService
  ) {
    super();
    this.entityManager = databaseService.manager;
  }
}
