export interface UserFile {
  userId: number;
  user: {
    username: string;
  };
  currentStorageSize: number;
  maxStorageSize: number;
  maxFileSize: number;
  updatedDate: Date;
}
