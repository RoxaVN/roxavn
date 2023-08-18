import { Api, ApiRequest, ApiResponse } from '../../base/index.js';
import { autoBind } from '../services/base.js';
import { ApiErrorJobManager, ApiSuccessJobManager } from './manager.js';

export function useApiSuccessJob<
  Req extends ApiRequest,
  Resp extends ApiResponse,
>(api: Api<Req, Resp>) {
  return (serviceClass: any) => {
    autoBind()(serviceClass);
    ApiSuccessJobManager.push({ serviceClass, api });
  };
}

export function useApiErrorJob<
  Req extends ApiRequest,
  Resp extends ApiResponse,
>(api: Api<Req, Resp>) {
  return (serviceClass: any) => {
    autoBind()(serviceClass);
    ApiErrorJobManager.push({ serviceClass, api });
  };
}
