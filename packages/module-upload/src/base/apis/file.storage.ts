import {
  ApiSource,
  ExactProps,
  IsOptional,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { permissions, scopes } from '../access';

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

export const fileStoageApi = {
  getMany: fileStoageSource.getMany({
    validator: GetFileStoragesRequest,
    permission: permissions.ReadFIleStorages,
  }),
  create: fileStoageSource.create({
    permission: permissions.CreateFIleStorages,
  }),
};
