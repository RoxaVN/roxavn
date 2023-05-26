import { type ServiceFactory } from '@roxavn/core/server';
import {
  StorageHandler,
  serverModule as uploadServerModule,
} from '@roxavn/module-upload/server';
import { GetSettingService } from '@roxavn/module-utils/server';
import { type ReadStream } from 'fs';

import { SeaweedFSClient } from './seaweedfs.client.js';
import { constants } from '../../base/index.js';
import { serverModule } from '../module.js';

export class SeaweedFSStorageHandler implements StorageHandler {
  name = 'SeaweedFS';
  defaultMaxFileSize = 0;
  defaultMaxSize = 0;

  constructor(private seaweedFSClient: SeaweedFSClient) {}

  upload(file: ReadStream) {
    return this.seaweedFSClient.write(file);
  }

  remove(fileId: string) {
    return this.seaweedFSClient.delete(fileId);
  }

  @serverModule.bindFactory()
  static create: ServiceFactory = async (context) => {
    const service = await context.container.getAsync(GetSettingService);
    const config = await service.handle({
      module: uploadServerModule.name,
      name: constants.SEAWEEDFS_SETTING,
    });
    const seaweedFSClient = new SeaweedFSClient(
      config?.masterUrl || constants.SEAWEEDFS_MASTER_URL_DEFAULT
    );
    return new SeaweedFSStorageHandler(seaweedFSClient);
  };
}
