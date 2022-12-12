import { Api, Empty, UnauthorizedException } from '@roxavn/core/share';

export const UploadFileApi: Api<Empty, Empty, UnauthorizedException> = {
  method: 'POST',
  path: '/file/upload',
};
