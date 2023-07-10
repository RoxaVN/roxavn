import { type InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { fileApi } from '../../base/index.js';
import { File as FileEntity } from '../entities/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(fileApi.getOne)
export class GetFileApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof fileApi.getOne>) {
    const result = await this.entityManager.getRepository(FileEntity).findOne({
      where: { id: request.fileId },
    });
    if (result) {
      return {
        id: result.id,
        name: result.name,
        mime: result.mime,
        url: result.url,
      };
    }
    throw new NotFoundException();
  }
}

@serverModule.injectable()
export class CreateFileService extends InjectDatabaseService {
  handle(request: {
    id: string;
    size: number;
    eTag: string;
    name: string;
    userId: string;
    mime: string;
    url: string;
    fileStorageId: string;
  }) {
    const file = new FileEntity();
    Object.assign(file, request);
    return this.entityManager.save(file);
  }
}
