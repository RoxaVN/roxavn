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

export interface SettingResponse {
  module: string;
  name: string;
  metadata: any;
  updatedDate: Date;
}

export type GetModuleSettingResponse = Collection<SettingResponse>;
