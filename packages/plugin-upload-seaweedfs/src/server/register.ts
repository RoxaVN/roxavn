import { GetStorageHandlerService } from '@roxavn/module-upload/server';

import { SeaweedFSStorageHandlerService } from './services/index.js';

GetStorageHandlerService.handlerServices.push(SeaweedFSStorageHandlerService);
