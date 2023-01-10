import { Collection } from '@roxavn/core/share';

export interface CreateSettingRequest {
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
