import { capitalize } from 'lodash-es';

import { databaseManager } from '../database/index.js';
import { moduleManager } from '../module.manager.js';
import { BaseService } from '../service/base.js';

export async function runModuleHooks(mode: string) {
  for (const m of moduleManager.modules) {
    await runModuleHook(m.name, mode);
  }
}

export async function runModuleHook(module: string, mode: string) {
  let hook;
  try {
    hook = await import(module + '/hook');
  } catch (e) {}
  if (hook) {
    const queryRunner = databaseManager.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const serviceClass = hook[capitalize(mode) + 'Hook'];
      const serviceIns: BaseService = new serviceClass(queryRunner.manager);
      await serviceIns.handle({});
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
