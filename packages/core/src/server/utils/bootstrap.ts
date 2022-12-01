import type { Express } from 'express';
import { databaseManager } from '../database';

import { ServerModule } from '../module';
import { registerApiRoutes } from './register';

export async function bootstrap(app: Express) {
  registerApiRoutes();
  app.use('/', ServerModule.apiRouter);
  ServerModule.errorMiddlerwares.map((handler) => app.use(handler));

  await databaseManager.createSource();
}
