export interface UserInfoResponse {
  id: number;
  birthday?: Date;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  avatar?: string;
  metadata?: any;

  createdDate: Date;
  updatedDate: Date;
}
