export interface Module {
  name: string;
  description: string;
  version: string;
  viewer?: {
    role?: {
      id: number;
      name: string;
    };
  };
}
