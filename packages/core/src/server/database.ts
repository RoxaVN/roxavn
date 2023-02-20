import fs from 'fs';
import path from 'path';

import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { constants } from '../base';
import { moduleManager } from './module.manager';

class DatabaseManager {
  dataSource!: DataSource;

  async createSource(options?: Partial<PostgresConnectionOptions>) {
    const isDev = process.env.NODE_ENV === constants.ENV_DEVELOPMENT;
    const modules = moduleManager.modules.map((m) => m.name);
    const modelPaths: string[] = [];
    modules.map((module) => {
      if (module === moduleManager.currentModule.name && isDev) {
        if (fs.existsSync('./src/server/entities')) {
          modelPaths.push('./src/server/entities/**/*.entity.ts');
        }
      } else {
        try {
          const serverPath = path.dirname(require.resolve(module + '/server'));
          if (fs.existsSync(path.join(serverPath, 'entities'))) {
            modelPaths.push(path.join(serverPath, 'entities/**/*.entity.js'));
          }
        } catch (e) {}
      }
    });

    this.dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: modelPaths,
      logging: isDev ? true : false,
      synchronize: isDev ? true : false,
      ...options,
    });
    await this.dataSource.initialize();
  }
}

export const databaseManager = new DatabaseManager();
