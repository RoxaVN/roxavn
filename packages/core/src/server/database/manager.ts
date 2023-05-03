import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { constants } from '../../base';
import { moduleManager } from './../module.manager';
import { MemoryQueryResultCache } from './cache';

class DatabaseManager {
  dataSource!: DataSource;
  private entities: any[] = [];

  async createSource(options?: Partial<PostgresConnectionOptions>) {
    const isDev = process.env.NODE_ENV === constants.ENV_DEVELOPMENT;
    this.entities = moduleManager.serverModules.map((m) => m.entities).flat();

    this.dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: this.entities,
      logging: isDev ? true : false,
      synchronize: isDev ? true : false,
      cache: {
        duration: constants.QUERY_CACHE_DURATION,
        provider() {
          return new MemoryQueryResultCache();
        },
      },
      ...options,
    });
    await this.dataSource.initialize();
  }

  getEntity(name: string) {
    const capitalName = name[0].toUpperCase() + name.slice(1);
    return this.entities.find((e) => e.name === capitalName);
  }
}

export const databaseManager = new DatabaseManager();
