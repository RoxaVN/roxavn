import { getPackageJson, moduleManager } from '@roxavn/core/server';
import repl from 'repl';

import { devService } from './dev.js';
import { buildService } from './build.js';
import { cliColors } from './lib/index.js';

class ReplService {
  async run(options: { plugin: string }) {
    devService.initEnv();
    buildService.compile();

    const replServer = repl.start(cliColors.green('> '));
    const coreServer = await import('@roxavn/core/server');

    await moduleManager.importServerModules();

    const packageJson = getPackageJson();
    let moduleHook = {};
    try {
      moduleHook = await import(packageJson.name + '/hook');
    } catch {}

    if (options?.plugin) {
      // load plugin
      await import(options.plugin);
    }
    Object.assign(replServer.context, coreServer, moduleHook);
  }
}

export const replService = new ReplService();
