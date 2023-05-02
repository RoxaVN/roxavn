import { useEffect, useState } from 'react';
import { Api, ApiRequest, ApiResponse, ErrorResponse } from '../../base';
import { HttpException, http } from './http';

export const apiFetcher = {
  getErrorData(e: HttpException): ErrorResponse | undefined {
    return e?.data?.error;
  },
  fetch<Request extends ApiRequest, Response extends ApiResponse>(
    api: Api<Request, Response>,
    data?: Request
  ): Promise<Response> {
    return apiFetcher[api.method](api.path, data).then((resp: any) => {
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

const cache: Record<string, any> = {};

export interface UseApiOptions {
  cache?: boolean;
}

export const useApi = <
  Request extends ApiRequest,
  Response extends ApiResponse
>(
  api?: Api<Request, Response>,
  apiParams?: Request,
  options?: UseApiOptions
) => {
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  function fetcher(params?: Request) {
    if (api) {
      setLoading(true);
      const timeout = setTimeout(() => {
        const key = api.path + '?' + JSON.stringify(params);
        if (options?.cache && cache[key]) {
          setLoading(false);
          setData(cache[key]);
        } else {
          apiFetcher
            .fetch(api, apiParams)
            .then((data) => {
              setLoading(false);
              setData(data);
              if (options?.cache) {
                cache[key] = data;
              }
            })
            .catch((error) => {
              setLoading(false);
              setError(error);
            });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
    return;
  }

  useEffect(() => {
    return fetcher(apiParams);
  }, [api?.path, JSON.stringify(apiParams)]);

  return { data, loading, error, fetcher };
};
