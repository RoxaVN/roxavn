import { Command } from 'commander';

import { buildService } from './build';
import { devService } from './dev';
import { moduleService } from './module';
import { templateService } from './template';
import { hookService } from './hook';

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
  .action((mode: string, module: string) => hookService.run(mode, module));

program
  .command('build')
  .description('Build module for publish')
  .action(() => buildService.compile());

export default program;
