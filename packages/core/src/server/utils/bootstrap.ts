import type { Express, NextFunction, Request, Response } from 'express';
import { databaseManager } from '../database';

import { ServerModule } from '../module';
import { registerServerModules } from './register';

export async function bootstrap(app: Express) {
  registerServerModules();
  app.use('/', ServerModule.apiRouter);
  for (const handler of ServerModule.errorMiddlewares) {
    app.use((error: any, req: Request, resp: Response, next: NextFunction) =>
      handler(
        error,
        { req, resp, dbSession: resp.locals.$queryRunner.manager },
        next
      )?.catch(next)
    );
  }

  await databaseManager.createSource();
}
