import { LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';

import { Api, ApiResponse, ApiRequest } from '../../share';
import { uiManager, apiFetcher } from '../services';

export interface ApiRenderProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  api: Api<Request, Response>;
  apiParams?: Request;
  useLoader?: boolean;
  onSuccess?: (resp: Response) => void;
  children: (props: {
    data: Response | null;
    error: any;
    loading: boolean;
    fetcher: (params?: Request) => void;
  }) => JSX.Element;
}

export function ApiRender<
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  api,
  apiParams,
  onSuccess,
  children,
  useLoader,
}: ApiRenderProps<Request, Response>) {
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const fetcher = async (params?: Request) => {
    try {
      setError(null);
      setLoading(true);
      const result = await apiFetcher.fetch(api, params);
      setData(result);
      onSuccess && onSuccess(result);
    } catch (e: any) {
      setError(e);
      uiManager.errorDialog(apiFetcher.getErrorData(e) || e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetcher(apiParams), 100);
    return () => clearTimeout(timeout);
  }, [api, apiParams]);

  const child = children({ data, error, loading, fetcher });
  if (useLoader) {
    return (
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        {child}
      </div>
    );
  } else {
    return child;
  }
}
