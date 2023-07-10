import { BaseService, serviceContainer } from '@roxavn/core/server';
import { ReadStream } from 'fs';

import { NotFoundStorageHandlerException } from '../../base/index.js';
import { serverModule } from '../module.js';
import { StorageHandlerType } from '../entities/index.js';

export interface StorageHandler {
  name: string;
  type: StorageHandlerType;
  defaultMaxSize: number;
  defaultMaxFileSize: number;
  upload(file: ReadStream): Promise<{ id: string; url: string; eTag: string }>;
  remove(fileId: string): Promise<{ success: boolean }>;
}

@serverModule.injectable()
export class GetStorageHandlerService extends BaseService {
  static handlerServices: Array<new (...args: any[]) => StorageHandler> = [];

  async handle(data?: {
    type?: StorageHandlerType;
    name?: string;
  }): Promise<StorageHandler> {
    const services: StorageHandler[] = await Promise.all(
      GetStorageHandlerService.handlerServices.map((s) =>
        serviceContainer.getAsync(s)
      )
    );

    // get first service
    let service;
    if (data?.type) {
      service = services.find((item) => item.type === data.type);
    } else if (data?.name) {
      service = services.find((item) => item.name === data.name);
    } else {
      service = services[0];
    }
    if (service) {
      return service;
    }
    throw new NotFoundStorageHandlerException();
  }
}
