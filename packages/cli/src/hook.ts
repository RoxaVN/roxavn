import {
  databaseManager,
  moduleManager,
  registerServerModules,
  runModuleHook,
  runModuleHooks,
} from '@roxavn/core/server';
import { constants } from '@roxavn/core/base';
import { buildService } from './build.js';
import { devService } from './dev.js';

class HookService {
  async run(mode: string, module?: string, options?: { plugin: string }) {
    devService.initEnv();
    Object.assign(process.env, {
      NODE_ENV: constants.ENV_PRODUCTION,
    });
    // must build to update lastest entities
    buildService.compile();

    registerServerModules();
    // load current module
    const m = require(moduleManager.currentModule.name +
      '/server').serverModule;
    moduleManager.serverModules.push(m);

    await databaseManager.createSource({ synchronize: true });

    if (options?.plugin) {
      // load plugin
      require(options.plugin);
    }

    if (module) {
      runModuleHook(module, mode);
    } else {
      runModuleHooks(mode);
    }
  }
}

export const hookService = new HookService();
