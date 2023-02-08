export interface UserFile {
  ownerId: number;
  owner: {
    username: string;
  };
  currentStorageSize: number;
  maxStorageSize: number;
  maxFileSize: number;
  updatedDate: Date;
}
