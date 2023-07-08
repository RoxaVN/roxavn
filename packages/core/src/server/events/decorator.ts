import { Api, ApiRequest, ApiResponse } from '../../base/index.js';
import { autoBind } from '../services/base.js';
import { RouterContextState } from '../services/index.js';
import { ApiErrorEventManager, ApiSuccessEventManager } from './manager.js';

export function onApiSuccess<Req extends ApiRequest, Resp extends ApiResponse>(
  api: Api<Req, Resp>
) {
  return (serviceClass: any) => {
    autoBind()(serviceClass);
    ApiSuccessEventManager.items.push({ serviceClass, api });
  };
}

export type InferOnApiSuccessData<T extends Api> = RouterContextState<T>;

export function onApiError<Req extends ApiRequest, Resp extends ApiResponse>(
  api: Api<Req, Resp>
) {
  return (serviceClass: any) => {
    autoBind()(serviceClass);
    ApiErrorEventManager.items.push({ serviceClass, api });
  };
}

export type InferOnApiErrorData<T extends Api> = RouterContextState<T> & {
  error: any;
};
