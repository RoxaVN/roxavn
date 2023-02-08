import { Collection } from '@roxavn/core/base';

export interface UpdateSettingRequest {
  module: string;
  name: string;
  metadata: any;
}

export interface GetModuleSettingRequest {
  module: string;
  name?: string;
}

export type GetModuleSettingResponse = Collection<{
  module: string;
  name: string;
  metadata: any;
  updatedDate: Date;
}>;
