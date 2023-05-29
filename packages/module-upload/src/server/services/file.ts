import {
  MaxPartSizeExceededError,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  NodeOnDiskFile,
} from '@remix-run/node';
import {
  BadRequestException,
  type InferApiRequest,
  NotFoundException,
} from '@roxavn/core/base';
import {
  BaseService,
  type InferContext,
  InjectDatabaseService,
  RawRequest,
  inject,
  AuthUser,
} from '@roxavn/core/server';
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

@serverModule.useApi(fileApi.upload)
export class UploadFileService extends BaseService {
  constructor(
    @inject(GetStorageHandlerService)
    private getStorageHandlerService: GetStorageHandlerService,
    @inject(GetUserFileStorageService)
    private getUserFileStorageService: GetUserFileStorageService,
    @inject(UpdateFileStorageService)
    private updateFileStorageService: UpdateFileStorageService,
    @inject(CreateFileService)
    private createFileService: CreateFileService
  ) {
    super();
  }

  async handle(
    data: InferApiRequest<typeof fileApi.upload>,
    @AuthUser authUser: InferContext<typeof AuthUser>,
    @RawRequest rawRequest: InferContext<typeof RawRequest>
  ) {
    const userId = authUser.id;
    const storageHandler = await this.getStorageHandlerService.handle();
    const storage = await this.getUserFileStorageService.handle({
      userId: userId,
      storageName: storageHandler.name,
    });
    const remainSize =
      storage.maxSize > 0 ? storage.maxSize - storage.currentSize : undefined;

    const uploadHandler = unstable_createFileUploadHandler({
      maxPartSize: remainSize,
    });
    let formData: FormData;
    try {
      formData = await unstable_parseMultipartFormData(
        rawRequest,
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
      const update = await this.updateFileStorageService.handle({
        userId: userId,
        storageName: storageHandler.name,
        fileSize: filesize,
      });
      if (update.error) {
        await storageHandler.remove(uploadResult.id);
        throw new ExceedsStorageLimitException(storage.maxSize);
      }

      await this.createFileService.handle({
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
  }
}

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
