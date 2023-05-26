import { BaseService, serviceContainer } from '@roxavn/core/server';
import { ReadStream } from 'fs';

import { NotFoundStorageHandlerException } from '../../base/index.js';
import { serverModule } from '../module.js';

export interface StorageHandler {
  name: string;
  defaultMaxSize: number;
  defaultMaxFileSize: number;
  upload(file: ReadStream): Promise<{ id: string; url: string; eTag: string }>;
  remove(fileId: string): Promise<{ success: boolean }>;
}

@serverModule.injectable()
export class GetStorageHandlerService extends BaseService {
  static handlerServices: Array<new (...args: any[]) => StorageHandler> = [];

  async handle() {
    // get first service
    const serviceClass = GetStorageHandlerService.handlerServices[0];
    if (serviceClass) {
      return await serviceContainer.getAsync(serviceClass);
    }
    throw new NotFoundStorageHandlerException();
  }
}
