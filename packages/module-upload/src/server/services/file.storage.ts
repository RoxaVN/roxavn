import {
  MaxPartSizeExceededError,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  NodeOnDiskFile,
} from '@remix-run/node';
import { BadRequestException, type InferApiRequest } from '@roxavn/core/base';
import {
  AuthUser,
  type InferContext,
  InjectDatabaseService,
  BaseService,
  inject,
  DatabaseService,
  RawRequest,
} from '@roxavn/core/server';
import { createReadStream } from 'fs';
import { Raw } from 'typeorm';

import {
  ExceedsStorageLimitException,
  ExceedsUploadLimitException,
  NotFoundUserStorageException,
  fileStorageApi,
} from '../../base/index.js';
import { FileStorage, StorageHandlerType } from '../entities/index.js';
import { serverModule } from '../module.js';
import { GetStorageHandlerService } from './storage.handler.js';
import { CreateFileService } from './file.js';

@serverModule.useApi(fileStorageApi.getMany)
export class GetFileStoragesApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof fileStorageApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(FileStorage)
      .findAndCount({
        select: {
          userId: true,
          currentSize: true,
          maxSize: true,
          maxFileSize: true,
          updatedDate: true,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.injectable()
export class CreateFileStorageApiService extends BaseService {
  constructor(
    @inject(GetStorageHandlerService)
    private getStorageHandlerService: GetStorageHandlerService,
    @inject(DatabaseService) private databaseService: DatabaseService
  ) {
    super();
  }

  async handle(request: {
    userid: string;
    type: StorageHandlerType;
    name: string;
  }) {
    const storageHandler = await this.getStorageHandlerService.handle({
      type: request.type,
    });
    const result = await this.databaseService.manager
      .createQueryBuilder()
      .insert()
      .into(FileStorage)
      .values({
        userId: request.userid,
        name: request.name,
        type: request.type,
        handler: storageHandler.name,
        maxSize: storageHandler.defaultMaxSize,
        maxFileSize: storageHandler.defaultMaxFileSize,
      })
      .orUpdate(['userId'], ['userId', 'name'])
      .returning('id')
      .execute();
    return result.raw[0];
  }
}

@serverModule.useApi(fileStorageApi.create)
export class CreateDefaultFileStorageApiService extends BaseService {
  constructor(
    @inject(CreateFileStorageApiService)
    private createFileStorageApiService: CreateFileStorageApiService
  ) {
    super();
  }

  handle(
    request: InferApiRequest<typeof fileStorageApi.create>,
    @AuthUser authUser: InferContext<typeof AuthUser>
  ) {
    return this.createFileStorageApiService.handle({
      userid: authUser.id,
      type: 'public',
      name: 'default',
    });
  }
}

@serverModule.injectable()
export class GetFileStorageService extends InjectDatabaseService {
  async handle(request: { fileStorageId: string }) {
    const result = await this.entityManager.getRepository(FileStorage).findOne({
      cache: true,
      where: { id: request.fileStorageId },
    });
    if (result) {
      return result;
    }
    throw new NotFoundUserStorageException();
  }
}

@serverModule.injectable()
export class UpdateFileStorageService extends InjectDatabaseService {
  async handle(request: { fileStorageId: string; fileSize: number }) {
    const result = await this.entityManager
      .getRepository(FileStorage)
      .increment(
        {
          id: request.fileStorageId,
          maxSize: Raw(
            (alias) =>
              `${alias} = 0 OR ${alias} > currentSize + ${request.fileSize}`
          ),
        },
        'currentSize',
        request.fileSize
      );
    return { error: !result.affected };
  }
}

@serverModule.useApi(fileStorageApi.upload)
export class UploadToFileStorageService extends BaseService {
  constructor(
    @inject(GetStorageHandlerService)
    private getStorageHandlerService: GetStorageHandlerService,
    @inject(GetFileStorageService)
    private getFileStorageService: GetFileStorageService,
    @inject(UpdateFileStorageService)
    private updateFileStorageService: UpdateFileStorageService,
    @inject(CreateFileService)
    private createFileService: CreateFileService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof fileStorageApi.upload>,
    @AuthUser authUser: InferContext<typeof AuthUser>,
    @RawRequest rawRequest: InferContext<typeof RawRequest>
  ) {
    const userId = authUser.id;
    const storage = await this.getFileStorageService.handle({
      fileStorageId: request.fileStorageId,
    });
    const storageHandler = await this.getStorageHandlerService.findByName(
      storage.handler
    );
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
        fileStorageId: request.fileStorageId,
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
