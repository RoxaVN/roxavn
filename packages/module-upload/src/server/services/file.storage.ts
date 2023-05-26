import { type InferApiRequest } from '@roxavn/core/base';
import {
  AuthUser,
  type InferContext,
  InjectDatabaseService,
  BaseService,
  inject,
  DatabaseService,
} from '@roxavn/core/server';
import { Raw } from 'typeorm';

import {
  NotFoundUserStorageException,
  fileStoageApi,
} from '../../base/index.js';
import { FileStorage } from '../entities/index.js';
import { serverModule } from '../module.js';
import { GetStorageHandlerService } from './storage.handler.js';

@serverModule.useApi(fileStoageApi.getMany)
export class GetFileStoragesApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof fileStoageApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.entityManager
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
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(fileStoageApi.create)
export class CreateFileStorageApiService extends BaseService {
  constructor(
    @inject(GetStorageHandlerService)
    private getStorageHandlerService: GetStorageHandlerService,
    @inject(DatabaseService) private databaseService: DatabaseService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof fileStoageApi.create>,
    @AuthUser authUser: InferContext<typeof AuthUser>
  ) {
    const storageHandler = await this.getStorageHandlerService.handle();
    const result = await this.databaseService.manager
      .createQueryBuilder()
      .insert()
      .into(FileStorage)
      .values({
        userId: authUser.id,
        name: storageHandler.name,
        maxSize: storageHandler.defaultMaxSize,
        maxFileSize: storageHandler.defaultMaxFileSize,
      })
      .orIgnore()
      .execute();
    return { id: result.raw };
  }
}

@serverModule.injectable()
export class GetUserFileStorageService extends InjectDatabaseService {
  async handle(request: { userId: string; storageName: string }) {
    const result = await this.entityManager.getRepository(FileStorage).findOne({
      where: { userId: request.userId, name: request.storageName },
    });
    if (result) {
      return result;
    }
    throw new NotFoundUserStorageException();
  }
}

@serverModule.injectable()
export class UpdateFileStorageService extends InjectDatabaseService {
  async handle(request: {
    userId: string;
    storageName: string;
    fileSize: number;
  }) {
    const result = await this.entityManager
      .getRepository(FileStorage)
      .increment(
        {
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
