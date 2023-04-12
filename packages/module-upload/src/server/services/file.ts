import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import {
  BadRequestException,
  InferApiRequest,
  NotFoundException,
} from '@roxavn/core/base';
import { ApiService, BaseService } from '@roxavn/core/server';
import sample from 'lodash/sample';

import { ExceedsStorageLimitException, fileApi } from '../../base';
import { File as FileEntity } from '../entities';
import { serverModule } from '../module';
import { SeaweedClient, seaweedClient } from './seaweed';
import {
  GetUserFileStorageService,
  UpdateFileStorageService,
} from './file.storage';
import { storageManager } from '../storage.handler';

const uploadHandler = unstable_createFileUploadHandler();

serverModule.useRawApi(fileApi.upload, async (_, args) => {
  const handler = storageManager.getFirst();
  const userId = args.state.$user.id;
  const formData = await unstable_parseMultipartFormData(
    args.request,
    uploadHandler
  );
  const file = formData.get('file') as File;
  if (!handler) {
    throw new NotFoundException();
  }
  if (file) {
    const filesize = file.length;
    const mime = file.type;
    const name = file.name;
    // check size
    const storage = await serverModule
      .createService(GetUserFileStorageService, args)
      .handle({ userId: userId, storageName: handler.name });
    if (storage.currentSize + filesize > storage.maxSize) {
      throw new ExceedsStorageLimitException(storage.maxSize);
    }

    const uploadResult = await handler.upload(file.stream(), file.length);

    // update storage later because avoid wait lock for update
    const update = await serverModule
      .createService(UpdateFileStorageService, args)
      .handle({
        userId: userId,
        storageName: handler.name,
        fileSize: filesize,
      });
    if (update.error) {
      await handler.remove(uploadResult.id);
      throw new ExceedsStorageLimitException(storage.maxSize);
    }

    await serverModule.createService(CreateFileService, args).handle({
      id: uploadResult.id,
      size: filesize,
      eTag: uploadResult.eTag,
      fileStorageId: storage.id,
      mime,
      name,
      userId,
    });

    return { id: uploadResult.id, mime, name, url: uploadResult.url };
  }
  throw new BadRequestException();
});

@serverModule.useApi(fileApi.getOne)
export class GetFileApiService extends ApiService {
  async handle(request: InferApiRequest<typeof fileApi.getOne>) {
    const result = await this.dbSession.getRepository(FileEntity).findOne({
      where: { id: request.fileId },
    });
    if (result) {
      const url = await this.create(GetFileUrlService).handle({
        fileId: result.id,
      });
      return {
        id: result.id,
        name: result.name,
        mime: result.mime,
        url: url,
      };
    }
    throw new NotFoundException();
  }
}

export class CreateFileService extends BaseService {
  handle(request: {
    id: string;
    size: number;
    eTag: string;
    name: string;
    userId: string;
    mime: string;
    fileStorageId: string;
  }) {
    const file = new FileEntity();
    Object.assign(file, request);
    return this.dbSession.save(file);
  }
}

const cacheVolume: Record<
  string,
  Awaited<ReturnType<SeaweedClient['lookup']>>['locations']
> = {};

export class GetFileUrlService extends BaseService {
  async handle(request: { fileId: string }) {
    const parts = request.fileId.split(',');
    let volumneLocations = cacheVolume[parts[0]];
    if (!volumneLocations) {
      const lookupResult = await seaweedClient.lookup({ volumeId: parts[0] });
      volumneLocations = lookupResult.locations;
      cacheVolume[parts[0]] = volumneLocations;
    }
    const publicUrl: string = (sample(volumneLocations) as any).publicUrl;
    return publicUrl + (publicUrl.endsWith('/') ? '' : '/') + request.fileId;
  }
}

export class UpdateUrlFOrItemService extends BaseService {
  async handle<T extends Record<string, any>>(request: {
    item: T;
    key: keyof T;
  }): Promise<T> {
    const result = { ...request.item };
    const fileId: any = result[request.key];
    const service = this.create(GetFileUrlService);
    if (Array.isArray(fileId)) {
      result[request.key] = (await Promise.all(
        fileId.map((f) => service.handle({ fileId: f }))
      )) as any;
    } else {
      result[request.key] = (await service.handle({ fileId: fileId })) as any;
    }
    return result;
  }
}

export class UpdateUrlFOrItemsService extends BaseService {
  async handle<T extends Record<string, any>>(request: {
    items: T[];
    key: keyof T;
  }): Promise<T[]> {
    const service = this.create(UpdateUrlFOrItemService);
    const result = [...request.items];
    for (let i = 0; i < result.length; i += 1) {
      result[i] = (await service.handle({
        item: result[i],
        key: request.key as any,
      })) as any;
    }
    return result;
  }
}
