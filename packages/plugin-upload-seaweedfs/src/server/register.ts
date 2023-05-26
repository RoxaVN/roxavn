import { GetStorageHandlerService } from '@roxavn/module-upload/server';

import { SeaweedFSStorageHandler } from './services/index.js';

GetStorageHandlerService.handlerServices.push(SeaweedFSStorageHandler);
