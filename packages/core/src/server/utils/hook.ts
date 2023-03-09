import capitalize from 'lodash/capitalize';

import { Role } from '../../base';
import { databaseManager } from '../database';
import { moduleManager } from '../module.manager';
import { BaseService } from '../service';

export async function runModuleHooks(mode: string) {
  for (const m of moduleManager.modules) {
    await runModuleHook(m.name, mode);
  }
}

export async function runModuleHook(module: string, mode: string) {
  let hook;
  try {
    hook = require(module + '/hook');
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

class CreateRoleService extends BaseService {
  handle(request: Record<string, Role>): Promise<void> {
    throw new Error(
      'CreateRoleService not implement ' + JSON.stringify(request)
    );
  }
}

class SetAdminRoleService extends BaseService {
  handle(request: Role): Promise<void> {
    throw new Error(
      'SetAdminRoleService not implement ' + JSON.stringify(request)
    );
  }
}

export const hookManager = {
  createRoleService: CreateRoleService,
  setAdminRoleService: SetAdminRoleService,
};
