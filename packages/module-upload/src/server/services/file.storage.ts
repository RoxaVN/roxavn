import { InferApiRequest } from '@roxavn/core/base';
import {
  ApiService,
  BaseService,
  InferAuthApiRequest,
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
export class GetFileStoragesApiService extends ApiService {
  async handle(request: InferApiRequest<typeof fileStoageApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dbSession
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
export class CreateFileStorageApiService extends ApiService {
  async handle(request: InferAuthApiRequest<typeof fileStoageApi.create>) {
    const storageHandler = await this.create(GetStorageHandlerService).handle();
    const result = await this.dbSession
      .createQueryBuilder()
      .insert()
      .into(FileStorage)
      .values({
        userId: request.$user.id,
        name: storageHandler.name,
        maxSize: storageHandler.defaultMaxSize,
        maxFileSize: storageHandler.defaultMaxFileSize,
      })
      .orIgnore()
      .execute();
    return { id: result.raw };
  }
}

export class GetUserFileStorageService extends BaseService {
  async handle(request: { userId: string; storageName: string }) {
    const result = await this.dbSession.getRepository(FileStorage).findOne({
      where: { userId: request.userId, name: request.storageName },
    });
    if (result) {
      return result;
    }
    throw new NotFoundUserStorageException();
  }
}

export class UpdateFileStorageService extends BaseService {
  async handle(request: {
    userId: string;
    storageName: string;
    fileSize: number;
  }) {
    const result = await this.dbSession.getRepository(FileStorage).increment(
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
