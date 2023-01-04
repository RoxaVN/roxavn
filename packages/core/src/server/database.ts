import fs from 'fs';
import path from 'path';

import {
  DataSource,
  Not,
  ILike,
  Equal,
  In,
  And,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  FindOperator,
} from 'typeorm';
import { constants, ApiFilter } from '../share';
import { appConfig } from './app.config';

class DatabaseManager {
  dataSource!: DataSource;

  async createSource() {
    const modules = Object.keys(appConfig.data.modules);
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

export class ServerApiFilter {
  static readonly filters: Record<string, (params: any) => FindOperator<any>> =
    {
      [ApiFilter.STARTS_WITH]: (value: string) => ILike(`${value}%`),
      [ApiFilter.ENDS_WITH]: (value: string) => ILike(`%${value}`),
      [ApiFilter.CONTAINS]: (value: string) => ILike(`%${value}%`),
      [ApiFilter.NOT_CONTAINS]: (value: string) => Not(ILike(`%${value}%`)),
      [ApiFilter.EQUALS]: (value: any) => Equal(value),
      [ApiFilter.NOT_EQUALS]: (value: any) => Not(Equal(value)),
      [ApiFilter.IN]: (...value: any[]) => In(value),
      [ApiFilter.LESS_THAN]: (value: any) => LessThan(value),
      [ApiFilter.LESS_THAN_OR_EQUAL_TO]: (value: any) => LessThanOrEqual(value),
      [ApiFilter.GREATER_THAN]: (value: any) => MoreThan(value),
      [ApiFilter.GREATER_THAN_OR_EQUAL_TO]: (value: any) =>
        MoreThanOrEqual(value),
    };

  static make(params: Record<string, any>) {
    const result = {};
    Object.entries(params).map(([key, value]) => {
      if (value instanceof ApiFilter && value.mode) {
        result[key] = this.filters[value.mode].apply(
          undefined,
          value.value as any
        );
      } else if (
        Array.isArray(value) &&
        value.every((i) => i instanceof ApiFilter)
      ) {
        result[key] = And(
          ...value.map((v) =>
            this.filters[v.mode].apply(undefined, v.value as any)
          )
        );
      }
    });
    return result;
  }
}
