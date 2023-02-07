import { useEffect, useState } from 'react';
import { Api, ApiRequest, ApiResponse, ErrorResponse } from '../../share';
import { HttpException, http } from './http';

export const apiFetcher = {
  getErrorData(e: HttpException): ErrorResponse | undefined {
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

export const useApi = <
  Request extends ApiRequest,
  Response extends ApiResponse
>(
  api?: Api<Request, Response>,
  apiParams?: Request
) => {
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (api) {
      const timeout = setTimeout(
        () =>
          apiFetcher
            .fetch(api, apiParams)
            .then((resp) => {
              setLoading(false);
              setData(resp);
            })
            .catch((error) => {
              setLoading(false);
              setError(error);
            }),
        100
      );
      return () => clearTimeout(timeout);
    }
    return;
  }, [api?.path, JSON.stringify(apiParams)]);

  return { data, loading, error };
};
