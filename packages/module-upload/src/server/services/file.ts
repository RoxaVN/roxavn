import {
  MaxPartSizeExceededError,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  NodeOnDiskFile,
} from '@remix-run/node';
import {
  BadRequestException,
  InferApiRequest,
  NotFoundException,
} from '@roxavn/core/base';
import { ApiService, BaseService } from '@roxavn/core/server';
import { createReadStream } from 'fs';

import {
  ExceedsStorageLimitException,
  ExceedsUploadLimitException,
  fileApi,
} from '../../base/index.js';
import { File as FileEntity } from '../entities/index.js';
import { serverModule } from '../module.js';
import {
  GetUserFileStorageService,
  UpdateFileStorageService,
} from './file.storage.js';
import { GetStorageHandlerService } from './storage.handler.js';

serverModule.useRawApi(fileApi.upload, async (_, args) => {
  const userId = args.state.$user.id;
  const storageHandler = await serverModule
    .createService(GetStorageHandlerService, args)
    .handle();
  const storage = await serverModule
    .createService(GetUserFileStorageService, args)
    .handle({ userId: userId, storageName: storageHandler.name });
  const remainSize =
    storage.maxSize > 0 ? storage.maxSize - storage.currentSize : undefined;

  const uploadHandler = unstable_createFileUploadHandler({
    maxPartSize: remainSize,
  });
  let formData: FormData;
  try {
    formData = await unstable_parseMultipartFormData(
      args.request,
      uploadHandler
    );
  } catch (e) {
    if (e instanceof MaxPartSizeExceededError) {
      throw new ExceedsStorageLimitException(storage.maxSize);
    } else {
      throw e;
    }
  }
  const file: NodeOnDiskFile = formData.get('file') as any;
  if (file) {
    const filesize = file.size;
    const mime = file.type;
    const name = file.name;

    if (storage.maxFileSize > 0 && storage.maxFileSize < filesize) {
      throw new ExceedsUploadLimitException(storage.maxFileSize);
    }

    const uploadResult = await storageHandler.upload(
      createReadStream(file.getFilePath())
    );

    // update storage later because avoid wait lock for update
    const update = await serverModule
      .createService(UpdateFileStorageService, args)
      .handle({
        userId: userId,
        storageName: storageHandler.name,
        fileSize: filesize,
      });
    if (update.error) {
      await storageHandler.remove(uploadResult.id);
      throw new ExceedsStorageLimitException(storage.maxSize);
    }

    await serverModule.createService(CreateFileService, args).handle({
      id: uploadResult.id,
      url: uploadResult.url,
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

export class CreateFileService extends BaseService {
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
    return this.dbSession.save(file);
  }
}
