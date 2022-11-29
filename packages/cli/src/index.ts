import { Command } from 'commander';

import { devService } from './dev';
import { moduleService } from './module';
import { templateService } from './template';

const program = new Command();

program
  .name('RoxavN cli')
  .description('Support roxavn development')
  .version('0.8.0');

program
  .command('module:sync')
  .description('Sync module after installing')
  .action(() => moduleService.sync());

program
  .command('create')
  .description('Create package')
  .action(() => templateService.createPackage());

program
  .command('dev')
  .description('Run dev server')
  .action(() => devService.run());

export default program;
