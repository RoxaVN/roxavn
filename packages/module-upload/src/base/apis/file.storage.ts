import {
  ApiSource,
  ExactProps,
  IsNumberString,
  IsOptional,
  Min,
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
  @Min(1)
  @IsNumberString()
  @IsOptional()
  public readonly page = 1;
}

export const fileStoageApi = {
  getMany: fileStoageSource.getMany({
    validator: GetFileStoragesRequest,
    permission: permissions.ReadFIleStorages,
  }),
};
