import fs from 'fs';
import path from 'path';

import { DataSource } from 'typeorm';
import { constants } from '../share';
import { appConfig } from './app.config';

class DatabaseManager {
  dataSource!: DataSource;

  async createSource() {
    const modules = Object.keys(appConfig.get().modules);
    const modelPaths: string[] = [];
    modules.map((module) => {
      if (module === '.') {
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

    const isDev = process.env.NODE_ENV === constants.ENV_DEVELOPMENT;
    this.dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: modelPaths,
      logging: isDev ? true : false,
      synchronize: isDev ? true : false,
    });
    await this.dataSource.initialize();
  }
}

export const databaseManager = new DatabaseManager();
