import { GetStorageHandlerService } from '@roxavn/module-upload/server';

import { SeaweedFSStorageHandlerService } from './services';

GetStorageHandlerService.handlerServices.push(SeaweedFSStorageHandlerService);
