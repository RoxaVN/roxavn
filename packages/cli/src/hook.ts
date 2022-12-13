import { databaseManager, runModuleHooks } from '@roxavn/core/server';
import { devService } from './dev';

class HookService {
  async run() {
    devService.initEnv();
    await databaseManager.createSource();
    runModuleHooks();
  }
}

export const hookService = new HookService();
