import { Collection } from '@roxavn/core/base';

export interface UpdateSettingRequest {
  module: string;
  name: string;
  type: 'public' | 'private';
  metadata: any;
}

export interface GetModuleSettingsRequest {
  module: string;
  name?: string;
}

export interface SettingResponse {
  module: string;
  name: string;
  metadata: any;
  updatedDate: Date;
}

export type GetModuleSettingsResponse = Collection<SettingResponse>;
