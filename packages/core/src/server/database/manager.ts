import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { constants } from '../../base';
import { moduleManager } from './../module.manager';
import { MemoryQueryResultCache } from './cache';

class DatabaseManager {
  dataSource!: DataSource;

  async createSource(options?: Partial<PostgresConnectionOptions>) {
    const isDev = process.env.NODE_ENV === constants.ENV_DEVELOPMENT;
    const entities = moduleManager.serverModules.map((m) => m.entities).flat();

    this.dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: entities,
      logging: isDev ? true : false,
      synchronize: isDev ? true : false,
      cache: {
        provider() {
          return new MemoryQueryResultCache();
        },
      },
      ...options,
    });
    await this.dataSource.initialize();
  }
}

export const databaseManager = new DatabaseManager();
