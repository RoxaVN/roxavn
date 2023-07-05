import { initEnv } from '@roxavn/core/server';
import { Command } from 'commander';

import { buildService } from './build.js';
import { devService } from './dev.js';
import { moduleService } from './module.js';
import { templateService } from './template.js';
import { replService } from './repl.js';
import { migrationService } from './migration.js';
import { serveService } from './serve.js';

initEnv();
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
  .command('migration [mode]')
  .description('Database migration')
  .action((mode: string) => {
    if (mode === 'run') {
      migrationService.run();
    } else if (mode === 'revert') {
      migrationService.revert();
    } else {
      migrationService.generate();
    }
  });

program
  .command('dev')
  .description('Run dev server')
  .action(() => devService.run());

program
  .command('serve')
  .description('Run production server')
  .action(() => serveService.run());

program
  .command('repl')
  .description('Run repl server')
  .action(() => replService.run());

program
  .command('build')
  .description('Build module for publish')
  .action(() => buildService.compile());

export default program;
