import { useEffect, useState } from 'react';

import { Api, ApiResponse, ApiRequest } from '../../share';
import { apiFetcher } from '../services/api.fetcher';

export interface ApiRenderProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  api: Api<Request, Response>;
  apiParams?: Request;
  children: (data: Response) => JSX.Element;
}

export function ApiRender<
  Request extends ApiRequest,
  Response extends ApiResponse
>({ api, apiParams, children }: ApiRenderProps<Request, Response>) {
  const [data, setData] = useState<Response>();
  useEffect(() => {
    apiFetcher.fetch(api, apiParams).then((data) => setData(data));
  }, []);
  return data ? (
    children(data)
  ) : (
    <div className="my-4 text-center">
      <i className="pi pi-spin pi-spinner text-4xl" />
    </div>
  );
}
