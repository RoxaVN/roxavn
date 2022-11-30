import { ErrorResponse } from './errors';
import { Permission } from './permission';
import { ExactProps } from './props';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Empty {}

export interface Id {
  /**
   * An id of an resource.
   */
  id: number;
}

export interface Collection<T> {
  /**
   * An array of items.
   */
  items: T[];
}

export interface Pagination {
  /**
   * Current page, starting from 1.
   */
  page: number;

  /**
   * Number of items per page.
   */
  pageSize: number;

  /**
   * Total pages.
   */
  totalPages: number;

  /**
   * Total items.
   */
  totalItems: number;
}

export interface PaginatedCollection<T> extends Collection<T> {
  /**
   * Pagination metadata.
   */
  pagination: Pagination;
}

export interface FullApiResponse {
  code: number;
  data?: any;
  error?: ErrorResponse;
}

export type ApiRequest = Record<string, any>;
export type ApiResponse = Record<string, any>;
export type ApiError = Record<string, any>;

export interface Api<
  Req extends ApiRequest = ApiRequest,
  Res extends ApiResponse = ApiResponse, // eslint-disable-line @typescript-eslint/no-unused-vars
  Error extends ApiError = ApiError // eslint-disable-line @typescript-eslint/no-unused-vars
> {
  /**
   * HTTP method.
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

  /**
   * Api path.
   */
  path: string;

  /**
   * Auth requirement.
   */
  auth?: 'LOGGED' | 'NOT_LOGGED';

  // request validator
  validator?: typeof ExactProps<Req>;

  /**
   * Permission.
   */
  permission?: Permission;
}

export type InferApiRequest<T> = T extends Api<infer U, any, any> ? U : never;
export type InferApiResponse<T> = T extends Api<any, infer U, any> ? U : never;
export type InferApiError<T> = T extends Api<any, any, infer U> ? U : never;
export type InferApiCollectionItem<T> = T extends Api<any, infer U, any>
  ? U extends Collection<infer V>
    ? V
    : never
  : never;

export type InferArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
