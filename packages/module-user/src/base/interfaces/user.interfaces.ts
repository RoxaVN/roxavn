export interface UserResponse {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  createdDate: Date;
  updatedDate: Date;
}
