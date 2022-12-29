import {
  databaseManager,
  runModuleHook,
  runModuleHooks,
} from '@roxavn/core/server';
import { devService } from './dev';

class HookService {
  async run(mode: string, module?: string) {
    devService.initEnv();
    await databaseManager.createSource();
    if (module) {
      runModuleHook(module, mode);
    } else {
      runModuleHooks(mode);
    }
  }
}

export const hookService = new HookService();
