import { Api, ApiResponse, ApiRequest } from '@roxavn/core-share';
import { HttpException, http } from './http';

const apiFetcher = {
  getErrorData(e: HttpException) {
    return e?.data?.error;
  },
  fetch<Request extends ApiRequest, Response extends ApiResponse>(
    api: Api<Request, Response>,
    data?: Request
  ): Promise<Response> {
    const method = api.method.toLowerCase();
    return apiFetcher[method](api.path, data).then((resp: any) => {
      if (resp?.code === 200) {
        return resp.data;
      }
      throw resp;
    });
  },
  get: (path: string, data?: Record<string, unknown>) =>
    http._urlParams(path, 'GET', data),
  head: (path: string, data?: Record<string, unknown>) =>
    http._urlParams(path, 'HEAD', data),
  options: (path: string, data?: Record<string, unknown>) =>
    http._urlParams(path, 'OPTIONS', data),
  post: (path: string, data?: Record<string, unknown>) =>
    http._bodyParams(path, 'POST', data),
  put: (path: string, data?: Record<string, unknown>) =>
    http._bodyParams(path, 'PUT', data),
  patch: (path: string, data?: Record<string, unknown>) =>
    http._bodyParams(path, 'PATCH', data),
  delete: (path: string, data?: Record<string, unknown>) =>
    http._bodyParams(path, 'DELETE', data),
};

export { apiFetcher };
