import { getPackageJson, moduleManager } from '@roxavn/core/server';
import repl from 'repl';

import { buildService } from './build.js';
import { cliColors } from './lib/index.js';

class ReplService {
  async run() {
    buildService.compile();

    const replServer = repl.start(cliColors.green('> '));
    const coreServer = await import('@roxavn/core/server');

    await moduleManager.importServerModules();

    const packageJson = getPackageJson();
    let moduleHook = {};
    try {
      moduleHook = await import(packageJson.name + '/hook');
    } catch {}

    Object.assign(replServer.context, coreServer, moduleHook);
  }
}

export const replService = new ReplService();
