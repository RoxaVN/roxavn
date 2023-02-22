import { useState } from 'react';
import { Api, ApiRequest, Collection, SuggestString } from '../../base';
import { useApi } from './api.fetcher';

export class Reference {
  constructor(
    private api: Api,
    private render: (item: any) => React.ReactNode,
    private key = 'id'
  ) {}

  update<T>(
    api: Api<ApiRequest, Collection<T>>,
    render: (item: T) => React.ReactNode,
    key = 'id'
  ) {
    this.api = api;
    this.render = render;
    this.key = key;
  }

  use(apiParams?: Record<SuggestString<'ids'>, any>) {
    const [params, setParams] = useState(apiParams);
    const { data, loading } = useApi(params ? this.api : undefined, params);

    return {
      setParams,
      renderItem: (key: any): React.ReactNode => {
        const item = data?.items.find((item: any) => item[this.key] === key);
        return loading ? null : item ? this.render(item) : null;
      },
    };
  }
}
