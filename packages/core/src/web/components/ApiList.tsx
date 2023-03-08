import { Box, Group, Pagination } from '@mantine/core';
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
  key?: string;
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
  key,
  containerRender,
}: ApiListProps<Request, ResponseItem>) => {
  const hash = useLocationHash('/list/' + (key || ''));
  const [params, setParams] = useSetState<Partial<Request>>({
    ...hash.params,
    ...apiParams,
  });
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
                <Group position="center">
                  <Pagination
                    mb="md"
                    value={data.pagination.page}
                    onChange={(page) => setParams({ page } as any)}
                    total={Math.ceil(
                      data.pagination.totalItems / data.pagination.pageSize
                    )}
                  />
                </Group>
              )}
            </div>
          );
        }
        return null;
      }}
    />
  );
};
