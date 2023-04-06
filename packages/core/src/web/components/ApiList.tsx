import { Box, Pagination } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { Fragment } from 'react';

import { Api, ApiRequest, Collection, PaginatedCollection } from '../../base';
import { useLocationHash } from '../hooks';
import { ApiForm } from './ApiForm';
import { ApiFetcherRef } from './ApiTable';

export interface ApiListProps<
  Request extends ApiRequest,
  ResponseItem extends Record<string, any>
> {
  api: Api<
    Request,
    PaginatedCollection<ResponseItem> | Collection<ResponseItem>
  >;
  apiParams?: Partial<Request>;
  locationKey?: string;
  itemKey?: keyof ResponseItem;
  itemRender: (
    item: ResponseItem,
    fetcherRef: ApiFetcherRef<Request>
  ) => React.ReactElement;
  containerRender?: (children: React.ReactElement[]) => React.ReactElement;
}

export const ApiList = <
  Request extends ApiRequest,
  ResponseItem extends Record<string, any>
>({
  api,
  apiParams,
  itemRender,
  itemKey,
  locationKey = '/list',
  containerRender,
}: ApiListProps<Request, ResponseItem>) => {
  const hash = useLocationHash(locationKey);
  const [params, setParams] = useSetState<Partial<Request>>({
    ...hash.params,
    ...apiParams,
  } as any);
  hash.setOnChange(params);

  return (
    <ApiForm
      fetchOnMount
      api={api}
      apiParams={params}
      dataRender={({ data, fetcher }) => {
        const ref = {
          fetch: fetcher,
          currentParams: params,
        };
        if (data) {
          const children = data.items.map((item) => (
            <Fragment key={item[itemKey || 'id']}>
              {itemRender(item, ref)}
            </Fragment>
          ));
          return (
            <div>
              {containerRender ? (
                containerRender(children)
              ) : (
                <Box mb="md">{children}</Box>
              )}
              {'pagination' in data && (
                <Pagination
                  mb="md"
                  position="center"
                  value={data.pagination.page}
                  onChange={(page) => setParams({ page } as any)}
                  total={Math.ceil(
                    data.pagination.totalItems / data.pagination.pageSize
                  )}
                />
              )}
            </div>
          );
        }
        return null;
      }}
    />
  );
};
