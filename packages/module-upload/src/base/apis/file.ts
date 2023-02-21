import { ApiSource, Empty, UnauthorizedException } from '@roxavn/core/base';
import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

interface FileResponse {
  id: string;
  name: string;
  mime: string;
  url: string;
}

const fileSource = new ApiSource<FileResponse>([Resources.File], baseModule);

export const fileApi = {
  upload: fileSource.custom<Empty, FileResponse, UnauthorizedException>({
    path: fileSource.apiPath() + '/upload',
    method: 'POST',
    permission: Permissions.UploadFile,
  }),
};
