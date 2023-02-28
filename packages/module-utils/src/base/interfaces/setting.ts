export interface UpdateSettingRequest {
  module: string;
  name: string;
  type: 'public' | 'private';
  metadata: any;
}

export interface SettingResponse {
  module: string;
  name: string;
  metadata: any;
  updatedDate: Date;
  type: 'public' | 'private';
}
