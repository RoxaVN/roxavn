import {
  StorageHandler,
  StorageHandlerService,
  serverModule as uploadServerModule,
} from '@roxavn/module-upload/server';
import { GetSettingService } from '@roxavn/module-utils/server';

import { SeaweedFSClient } from './seaweedfs.client';
import { constants } from '../../base';

export class SeaweedFSStorageHandler implements StorageHandler {
  name: 'SeaweedFS';
  defaultMaxFileSize: 0;
  defaultMaxSize: 0;

  constructor(private seaweedFSClient: SeaweedFSClient) {}

  upload(file: ReadableStream<any>, size: number) {
    return this.seaweedFSClient.write(file, size);
  }

  remove(fileId: string) {
    return this.seaweedFSClient.delete(fileId);
  }
}

export class SeaweedFSStorageHandlerService extends StorageHandlerService {
  static handlerName = 'SeaweedFS';
  static handler?: SeaweedFSStorageHandler;

  async handle() {
    if (!SeaweedFSStorageHandlerService.handler) {
      const config = await this.create(GetSettingService).handle({
        module: uploadServerModule.name,
        name: constants.SEAWEEDFS_SETTING,
      });

      const seaweedFSClient = new SeaweedFSClient(
        config?.masterUrl || constants.SEAWEEDFS_MASTER_URL_DEFAULT
      );
      SeaweedFSStorageHandlerService.handler = new SeaweedFSStorageHandler(
        seaweedFSClient
      );
    }
    return SeaweedFSStorageHandlerService.handler;
  }
}
