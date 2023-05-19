import {
  ApiSource,
  ArrayMaxSize,
  Empty,
  ExactProps,
  IsNumberString,
  IsOptional,
  Min,
  MinLength,
  TransformArray,
  UnauthorizedException,
} from '@roxavn/core/base';
import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface FileInfo {
  id: string;
  name: string;
  mime: string;
  url: string;
}

const fileSource = new ApiSource<FileInfo>([scopes.File], baseModule);

class GetFileRequest extends ExactProps<GetFileRequest> {
  @MinLength(1)
  public readonly fileId: string;
}

class GetFilesRequest extends ExactProps<GetFilesRequest> {
  @Min(1)
  @IsNumberString()
  @IsOptional()
  public readonly page = 1;

  @ArrayMaxSize(10)
  @MinLength(1, { each: true })
  @TransformArray()
  public readonly ids: string[];
}

export const fileApi = {
  upload: fileSource.custom<Empty, FileInfo, UnauthorizedException>({
    path: fileSource.apiPath() + '/upload',
    method: 'post',
    permission: permissions.UploadFile,
  }),
  getOne: fileSource.getOne({
    validator: GetFileRequest,
    permission: permissions.ReadFile,
  }),
  getMany: fileSource.getMany({
    validator: GetFilesRequest,
    permission: permissions.ReadFiles,
  }),
};
