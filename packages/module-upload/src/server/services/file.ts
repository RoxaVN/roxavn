import {
  InferApiRequest,
  InferApiResponse,
  NotFoundException,
  ServerException,
} from '@roxavn/core/base';
import { ApiService, BaseService } from '@roxavn/core/server';
import busboy from 'busboy';
import sample from 'lodash/sample';

import { ExceedsStorageLimitException, fileApi } from '../../base';
import { File, FileStorage } from '../entities';
import { serverModule } from '../module';
import { SeaweedClient, seaweedClient } from './seaweed';

serverModule.useRawApi(fileApi.upload, (_, { req, dbSession, resp }) => {
  return new Promise<InferApiResponse<typeof fileApi.upload>>(
    (resolve, reject) => {
      const bb = busboy({ headers: req.headers });
      bb.on('file', async (name, fileStream, info) => {
        try {
          const result = await seaweedClient.write(fileStream);
          const fileName = Buffer.from(info.filename, 'latin1').toString(
            'utf8'
          );

          const userId = resp.locals.$user.id;
          let storage = await dbSession
            .getRepository(FileStorage)
            .findOne({ where: { userId: userId } });
          if (!storage) {
            storage = new FileStorage();
            storage.userId = userId;
          }
          storage.currentSize += result.size;
          if (storage.maxSize && storage.currentSize > storage.maxSize) {
            return reject(new ExceedsStorageLimitException(storage.maxSize));
          }
          await dbSession.save(storage);

          const file = new File();
          file.id = result.fid;
          file.size = result.size;
          file.etag = result.eTag;
          file.name = fileName;
          file.userId = userId;
          file.mime = info.mimeType;
          file.fileStorageId = storage.id;
          await dbSession.save(file);

          resolve({
            id: result.fid,
            mime: info.mimeType,
            url: result.url,
            name: fileName,
          });
        } catch (e) {
          console.log(e);
          reject(new ServerException());
        }
      });
      req.pipe(bb);
    }
  );
});

@serverModule.useApi(fileApi.getOne)
export class GetFileApiService extends ApiService {
  async handle(request: InferApiRequest<typeof fileApi.getOne>) {
    const result = await this.dbSession.getRepository(File).findOne({
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
