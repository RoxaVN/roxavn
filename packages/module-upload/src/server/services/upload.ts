import { InferApiResponse, ServerException } from '@roxavn/core/share';
import busboy from 'busboy';

import { ExceedsStorageLimitException, UploadFileApi } from '../../share';
import { File, UserFile } from '../entities';
import { serverModule } from '../module';
import { seaweedClient } from './seaweed';

serverModule.useApi(UploadFileApi, (_, { req, dataSource, resp }) => {
  return new Promise<InferApiResponse<typeof UploadFileApi>>(
    (resolve, reject) => {
      const bb = busboy({ headers: req.headers });
      bb.on('file', async (name, fileStream, info) => {
        try {
          const result = await seaweedClient.write(fileStream);
          const fileName = Buffer.from(info.filename, 'latin1').toString(
            'utf8'
          );

          await dataSource.transaction(async (manager) => {
            const ownerId = resp.locals.user.id;
            let userFile = await manager
              .getRepository(UserFile)
              .findOne({ where: { ownerId: ownerId } });
            if (!userFile) {
              userFile = new UserFile();
              userFile.ownerId = ownerId;
            }
            userFile.currentStorageSize += result.size;
            if (
              userFile.maxStorageSize &&
              userFile.currentStorageSize > userFile.maxStorageSize
            ) {
              return reject(
                new ExceedsStorageLimitException(userFile.maxStorageSize)
              );
            }
            await manager.save(userFile);

            const file = new File();
            file.id = result.fid;
            file.size = result.size;
            file.etag = result.eTag;
            file.name = fileName;
            file.ownerId = ownerId;
            file.mime = info.mimeType;
            await manager.save(file);

            resolve({
              id: result.fid,
              mime: info.mimeType,
              url: result.url,
              name: fileName,
            });
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
