import {
  databaseManager,
  runModuleHook,
  runModuleHooks,
} from '@roxavn/core/server';
import { constants } from '@roxavn/core/base';
import { buildService } from './build';
import { devService } from './dev';

class HookService {
  async run(mode: string, module?: string) {
    devService.initEnv();
    Object.assign(process.env, {
      NODE_ENV: constants.ENV_PRODUCTION,
    });
    // must build to update lastest entities
    buildService.compile({});

    await databaseManager.createSource({ synchronize: true });
    if (module) {
      runModuleHook(module, mode);
    } else {
      runModuleHooks(mode);
    }
  }
}

export const hookService = new HookService();
