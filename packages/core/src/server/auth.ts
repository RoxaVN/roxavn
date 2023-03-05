import { Api, InferApiRequest, InferApiResponse } from '../base';
import { BaseService } from './service';

export type AuthenticatedData = {
  $user: { id: string };
  $accessToken: { id: string };
  $getResource: () => Promise<Record<string, any> | null>;
};

export type InferAuthApiRequest<T> = T extends Api<infer U, any, any>
  ? U & AuthenticatedData
  : never;

export abstract class AuthApiService<T extends Api = Api> extends BaseService<
  InferApiRequest<T> & AuthenticatedData,
  InferApiResponse<T>
> {}
