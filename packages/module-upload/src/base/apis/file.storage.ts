import {
  ApiSource,
  ExactProps,
  IsNumberString,
  IsOptional,
  Min,
} from '@roxavn/core/base';

import { baseModule } from '../module';
import { Permissions, Resources } from '../roles';

const fileStoageSource = new ApiSource<{
  userId: number;
  currentSize: number;
  maxSize: number;
  maxFileSize: number;
  updatedDate: Date;
}>([Resources.FileStorage], baseModule);

class GetFileStoragesRequest extends ExactProps<GetFileStoragesRequest> {
  @Min(1)
  @IsNumberString()
  @IsOptional()
  public readonly page = 1;
}

export const fileStoageApi = {
  getMany: fileStoageSource.getMany({
    validator: GetFileStoragesRequest,
    permission: Permissions.ReadFIleStorages,
  }),
};
