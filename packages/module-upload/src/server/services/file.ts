import { InferApiResponse, ServerException } from '@roxavn/core/base';
import busboy from 'busboy';

import { ExceedsStorageLimitException, fileApi } from '../../base';
import { File, FileStorage } from '../entities';
import { serverModule } from '../module';
import { seaweedClient } from './seaweed';

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

          const userId = resp.locals.user.id;
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
          reject(new ServerException());
        }
      });
      req.pipe(bb);
    }
  );
});

export {};
