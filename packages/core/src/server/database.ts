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
import { moduleManager } from './module.manager';

class DatabaseManager {
  dataSource!: DataSource;

  async createSource() {
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
    });
    await this.dataSource.initialize();
  }
}

export const databaseManager = new DatabaseManager();

export class QueryUtils {
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

  static filter(request: Record<string, any>) {
    const result = {};
    Object.entries(request).map(([key, value]) => {
      if (value instanceof ApiFilter && value.mode) {
        const args: any = value.value.filter((v) => v);
        if (args.length) {
          result[key] = this.filters[value.mode].apply(undefined, args);
        }
      } else if (
        Array.isArray(value) &&
        value.every((i) => i instanceof ApiFilter)
      ) {
        const operations: Array<FindOperator<any>> = [];
        for (const item of value as Array<ApiFilter>) {
          const args: any = item.value.filter((v) => v);
          if (args.length && item.mode) {
            operations.push(this.filters[item.mode].apply(undefined, args));
          }
        }
        result[key] = And(...operations);
      }
    });
    return result;
  }
}
