import type { Express, NextFunction, Request, Response } from 'express';
import { databaseManager } from '../database';

import { ServerModule } from '../module';
import { registerApiRoutes } from './register';

export async function bootstrap(app: Express) {
  registerApiRoutes();
  app.use('/', ServerModule.apiRouter);
  for (const handler of ServerModule.errorMiddlerwares) {
    app.use((error: any, req: Request, resp: Response, next: NextFunction) =>
      handler(
        error,
        { req, resp, dataSource: databaseManager.dataSource },
        next
      )?.catch(next)
    );
  }

  await databaseManager.createSource();
}
