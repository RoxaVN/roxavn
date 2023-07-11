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

  private async getServices(): Promise<StorageHandler[]> {
    return await Promise.all(
      GetStorageHandlerService.handlerServices.map((s) =>
        serviceContainer.getAsync(s)
      )
    );
  }

  async findByName(name: string) {
    const services = await this.getServices();
    const result = services.find((s) => s.name === name);
    if (result) {
      return result;
    }
    throw new NotFoundStorageHandlerException();
  }

  async handle(data?: { type?: StorageHandlerType }): Promise<StorageHandler> {
    const services = await this.getServices();

    let service;
    if (data?.type) {
      service = services.find((item) => item.type === data.type);
    }
    // not found service, get first service
    if (!service) {
      service = services[0];
    }
    if (service) {
      return service;
    }
    throw new NotFoundStorageHandlerException();
  }
}
