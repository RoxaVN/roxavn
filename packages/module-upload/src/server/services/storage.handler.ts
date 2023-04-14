import { NotFoundException } from '@roxavn/core/base';
import { BaseService } from '@roxavn/core/server';

export interface StorageHandler {
  name: string;
  defaultMaxSize: number;
  defaultMaxFileSize: number;
  upload(
    file: ReadableStream,
    size: number
  ): Promise<{ id: string; url: string; eTag: string }>;
  remove(fileId: string): Promise<void>;
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
      return service.handle({});
    }
    throw new NotFoundException();
  }
}
