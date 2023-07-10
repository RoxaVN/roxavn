import {
  ApiSource,
  ExactProps,
  IsOptional,
  MinLength,
  TransformNumber,
  UnauthorizedException,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';
import { FileInfo } from './file.js';

const fileStoageSource = new ApiSource<{
  userId: string;
  currentSize: number;
  maxSize: number;
  maxFileSize: number;
  updatedDate: Date;
}>([scopes.FileStorage], baseModule);

class GetFileStoragesRequest extends ExactProps<GetFileStoragesRequest> {
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;
}

class UploadToFileStorageRequest extends ExactProps<UploadToFileStorageRequest> {
  @MinLength(1)
  public readonly fileStorageId!: string;
}

export const fileStorageApi = {
  getMany: fileStoageSource.getMany({
    validator: GetFileStoragesRequest,
    permission: permissions.ReadFIleStorages,
  }),
  create: fileStoageSource.create({
    permission: permissions.CreateFIleStorages,
  }),
  upload: fileStoageSource.custom<
    UploadToFileStorageRequest,
    FileInfo,
    UnauthorizedException
  >({
    path: fileStoageSource.apiPath({ includeId: true }) + '/upload',
    method: 'POST',
    permission: permissions.UploadToFileStorage,
    validator: UploadToFileStorageRequest,
  }),
};
