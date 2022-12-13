import { Api, Empty, UnauthorizedException } from '@roxavn/core/share';

interface UploadFileResponse {
  id: string;
  name: string;
  mime: string;
  url: string;
}

export const UploadFileApi: Api<
  Empty,
  UploadFileResponse,
  UnauthorizedException
> = {
  method: 'POST',
  path: '/file/upload',
};
