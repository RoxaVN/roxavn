import { format } from '@sqltools/formatter/lib/sqlFormatter.js';
import { constants } from '@roxavn/core/base';
import {
  DatabaseService,
  moduleManager,
  serviceContainer,
} from '@roxavn/core/server';
import { templateService } from './template.js';

class MigrationService {
  async init() {
    Object.assign(process.env, {
      NODE_ENV: constants.ENV_PRODUCTION,
      DATABASE_URL: 'postgresql://admin:admin@localhost:5434/example',
      TOKEN_SIGN_SECRET: 'thisislongtokensecret',
    });

    await moduleManager.importServerModules();

    return serviceContainer.getAsync(DatabaseService);
  }

  protected queryParams(parameters: any[] | undefined): string {
    if (!parameters || !parameters.length) {
      return '';
    }

    return `, ${JSON.stringify(parameters)}`;
  }

  protected prettifyQuery(query: string) {
    const formattedQuery = format(query, { indent: '  ' });
    return '\n' + formattedQuery.replace(/^/gm, '      ') + '\n      ';
  }

  async generate() {
    const databaseService = await this.init();
    const sqlInMemory = await databaseService.dataSource.driver
      .createSchemaBuilder()
      .log();

    sqlInMemory.upQueries.forEach((upQuery) => {
      upQuery.query = this.prettifyQuery(upQuery.query);
    });
    sqlInMemory.downQueries.forEach((downQuery) => {
      downQuery.query = this.prettifyQuery(downQuery.query);
    });

    const upSqls: string[] = [],
      downSqls: string[] = [];

    sqlInMemory.upQueries.forEach((upQuery) => {
      upSqls.push(
        '    await queryRunner.query(`' +
          upQuery.query.replace(new RegExp('`', 'g'), '\\`') +
          '`' +
          this.queryParams(upQuery.parameters) +
          ');'
      );
    });
    sqlInMemory.downQueries.forEach((downQuery) => {
      downSqls.push(
        '    await queryRunner.query(`' +
          downQuery.query.replace(new RegExp('`', 'g'), '\\`') +
          '`' +
          this.queryParams(downQuery.parameters) +
          ');'
      );
    });

    if (!upSqls.length) {
      console.log('No changes in database schema were found');
      return;
    }

    templateService.generate([
      'migration',
      'new',
      '--upSqls',
      upSqls.join('\n'),
      '--downSqls',
      downSqls.reverse().join('\n'),
    ]);
  }

  async run() {
    const databaseService = await this.init();
    await databaseService.dataSource.runMigrations();
  }

  async revert() {
    const databaseService = await this.init();
    await databaseService.dataSource.undoLastMigration();
  }
}

export const migrationService = new MigrationService();
