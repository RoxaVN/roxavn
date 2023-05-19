import { BaseService } from '@roxavn/core/server';
import { ReadStream } from 'fs';

import { NotFoundStorageHandlerException } from '../../base/index.js';

export interface StorageHandler {
  name: string;
  defaultMaxSize: number;
  defaultMaxFileSize: number;
  upload(file: ReadStream): Promise<{ id: string; url: string; eTag: string }>;
  remove(fileId: string): Promise<{ success: boolean }>;
}

export abstract class StorageHandlerService extends BaseService {
  static handlerName: string;

  abstract handle(): Promise<StorageHandler>;
}

export class GetStorageHandlerService extends BaseService {
  static handlerServices: Array<new (...args: any[]) => StorageHandlerService> =
    [];

  async handle() {
    // get first service
    const serviceClass = GetStorageHandlerService.handlerServices[0];
    if (serviceClass) {
      const service = this.create(serviceClass);
      return service.handle();
    }
    throw new NotFoundStorageHandlerException();
  }
}
