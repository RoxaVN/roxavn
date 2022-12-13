import { InferApiResponse, ServerException } from '@roxavn/core/share';
import busboy from 'busboy';

import { UploadFileApi } from '../../share';
import { UserFile } from '../entities';
import { serverModule } from '../module';
import { seaweedClient } from './seaweed';

serverModule.useApi(UploadFileApi, (_, { req, dataSource, resp }) => {
  return new Promise<InferApiResponse<typeof UploadFileApi>>(
    (resolve, reject) => {
      const bb = busboy({ headers: req.headers });
      bb.on('file', async (name, fileStream, info) => {
        try {
          const result = await seaweedClient.write(fileStream);

          const userFile = new UserFile();
          userFile.id = result.fid;
          userFile.size = result.size;
          userFile.etag = result.eTag;
          userFile.name = Buffer.from(info.filename, 'latin1').toString('utf8');
          userFile.ownerId = resp.locals.user.id;
          userFile.mime = info.mimeType;

          dataSource.getRepository(UserFile).save(userFile);

          resolve({
            id: userFile.id,
            mime: userFile.mime,
            url: result.url,
            name: userFile.name,
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
