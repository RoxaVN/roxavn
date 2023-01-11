import { Api, Empty, UnauthorizedException } from '@roxavn/core/share';
import { baseModule } from '../module';

interface UploadFileResponse {
  id: string;
  name: string;
  mime: string;
  url: string;
}

export const uploadFileApi: Api<
  Empty,
  UploadFileResponse,
  UnauthorizedException
> = baseModule.api({
  method: 'POST',
  path: '/file/upload',
});
