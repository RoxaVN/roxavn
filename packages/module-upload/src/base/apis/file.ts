import { ApiSource, Empty, UnauthorizedException } from '@roxavn/core/base';
import { baseModule } from '../module';
import { permissions, scopes } from '../access';

interface FileResponse {
  id: string;
  name: string;
  mime: string;
  url: string;
}

const fileSource = new ApiSource<FileResponse>([scopes.File], baseModule);

export const fileApi = {
  upload: fileSource.custom<Empty, FileResponse, UnauthorizedException>({
    path: fileSource.apiPath() + '/upload',
    method: 'POST',
    permission: permissions.UploadFile,
  }),
};
