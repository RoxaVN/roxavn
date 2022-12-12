import busboy from 'busboy';

import { UploadFileApi } from '../../share';
import { serverModule } from '../module';
import { seaweedClient } from './seaweed';

serverModule.useApi(UploadFileApi, async (_, { req }) => {
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (name, fileStream) => {
    const result = await seaweedClient.write(fileStream);
    console.log(result);
  });
  req.pipe(bb);
});

export {};
