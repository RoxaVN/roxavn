import { ServerModule, serviceManager } from '@roxavn/core/server';
import { baseModule } from '../base/index.js';
import * as entities from './entities/index.js';
import {
  authenticatorLoaderMiddleware,
  authenticatorMiddleware,
  checkUserPermission,
} from './middlewares/index.js';

export const serverModule = ServerModule.fromBase(baseModule, { entities });

serverModule.onBeforeServerStart = async () => {
  serviceManager.checkUserPermission = checkUserPermission;
  ServerModule.authenticatorLoaderMiddleware = authenticatorLoaderMiddleware;
  ServerModule.authenticatorMiddleware = authenticatorMiddleware;
};
