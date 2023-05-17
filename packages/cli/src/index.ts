import { Command } from 'commander';

import { buildService } from './build.js';
import { devService } from './dev.js';
import { moduleService } from './module.js';
import { templateService } from './template.js';
import { hookService } from './hook.js';

const program = new Command();

program
  .name('RoxavN cli')
  .description('Support roxavn development')
  .version('0.1.0');

program
  .command('sync')
  .description('Sync module after installing')
  .action(() => moduleService.sync());

program
  .command('gen <generator> [action]')
  .description('Generate from template')
  .action((generator: string, action?: string) =>
    templateService.generate([generator, action || 'new'])
  );

program
  .command('dev')
  .description('Run dev server')
  .action(() => devService.run());

program
  .command('hook <mode> [module]')
  .description('Run hook script, or all if no module supplied')
  .option('-p, --plugin <type>', 'plugin service', '@roxavn/module-user/hook')
  .action((mode: string, module: string, options) =>
    hookService.run(mode, module, options)
  );

program
  .command('build')
  .description('Build module for publish')
  .action(() => buildService.compile());

export default program;
