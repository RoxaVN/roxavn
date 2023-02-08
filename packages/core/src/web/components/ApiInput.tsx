import { Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { Api, ApiRequest, Collection } from '../../base';
import { useApi, webModule } from '../services';

export type ApiInputProps<
  Request extends ApiRequest,
  ResponseItem,
  ComponentProps extends { data: ComponentProps['data'] }
> = {
  api: Api<Request, Collection<ResponseItem>>;
  apiParams?: Partial<Request>;
  convertData: (items: ResponseItem[]) => ComponentProps['data'];
  onSearchChangeProp: keyof ComponentProps;
  searchKey: keyof Request;
  idsKey?: keyof Request;
  fetchOnFocus?: boolean;
  component: React.ComponentType<ComponentProps>;
} & Omit<ComponentProps, 'data'>;

export const ApiInput = <
  Request extends ApiRequest,
  ResponseItem,
  ComponentProps extends { data: ComponentProps['data'] }
>({
  api,
  apiParams,
  convertData,
  component,
  onSearchChangeProp,
  searchKey,
  idsKey,
  fetchOnFocus,
  ...props
}: ApiInputProps<Request, ResponseItem, ComponentProps>) => {
  const { t } = webModule.useTranslation();
  const [_api, setApi] = useState<Api>();
  const [_apiParams, setApiParams] = useState<Partial<Request>>(
    apiParams || {}
  );
  const [paramsDebounced] = useDebouncedValue(_apiParams, 200);
  const { data, loading } = useApi(_api, paramsDebounced);
  const searchData: any = data ? convertData(data.items) : [];
  const Component = component;

  useEffect(() => {
    if ('value' in props && props.value) {
      setApi(api);
      setApiParams({ [idsKey || 'ids']: props.value, ...apiParams } as any);
    }
  }, []);

  return (
    <Component
      {...(props as any)}
      nothingFound={loading ? t('loading') : t('emptyMessage')}
      rightSection={loading && <Loader size="xs" />}
      data={searchData}
      {...{
        [onSearchChangeProp]: (value: string) => {
          if (
            value &&
            // when user choose item, component will trigger onSearchChangeProp with value be selected item
            // so don't search with it
            !searchData.find((i: any) => i === value || i.label === value)
          ) {
            !_api && setApi(api);
            setApiParams({ [searchKey]: value, ...apiParams } as any);
          }
          if (onSearchChangeProp in props) {
            (props as any)[onSearchChangeProp](value);
          }
        },
        onFocus: (e: any) => {
          !_api && fetchOnFocus && setApi(api);
          if ('onFocus' in props) {
            (props as any).onFocus(e);
          }
        },
      }}
    />
  );
};
