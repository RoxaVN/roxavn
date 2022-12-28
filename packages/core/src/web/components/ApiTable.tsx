import { LoadingOverlay, Table, Pagination, Group, Box } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { MutableRefObject } from 'react';

import {
  Api,
  ApiRequest,
  InferApiRequest,
  PaginatedCollection,
} from '../../share';
import { ApiRender } from './ApiRender';

export interface ApiTableColumn<T, K extends keyof T> {
  key: K;
  title: React.ReactNode;
  render?: (value: T[K], item: T) => React.ReactNode;
}

type ApiPaginationRequest = ApiRequest & { page: number };

export type ApiFetcherRef<T extends Api<ApiPaginationRequest>> = {
  handle: (params?: InferApiRequest<T>) => void;
  currentParams: InferApiRequest<T>;
};

export interface ApiTable<
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
> {
  api: Api<Request, PaginatedCollection<ResponseItem>>;
  apiParams?: Request;
  fetcherRef?: MutableRefObject<ApiFetcherRef<Api<Request>> | undefined>;
  columns: Array<ApiTableColumn<ResponseItem, keyof ResponseItem>>;
  rowKey?: keyof ResponseItem;
  actionsCell?: (item: ResponseItem) => React.ReactNode;
}

export const ApiTable = <
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
>({
  api,
  apiParams,
  columns,
  rowKey,
  actionsCell,
  fetcherRef,
}: ApiTable<Request, ResponseItem>) => {
  const [params, setParams] = useSetState<Request>(
    apiParams || ({ page: 1 } as Request)
  );

  return (
    <ApiRender api={api} apiParams={params}>
      {({ data, loading, fetcher }) => {
        if (fetcherRef) {
          fetcherRef.current = {
            handle: fetcher,
            currentParams: params,
          };
        }
        return (
          <Box sx={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            <Table mb="md">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key as string}>{column.title}</th>
                  ))}
                  {actionsCell && <th></th>}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item) => (
                  <tr key={item[(rowKey || 'id') as any]}>
                    {columns.map((column) => (
                      <td key={column.key as string}>
                        {column.render
                          ? column.render(item[column.key], item)
                          : (item[column.key] as any)}
                      </td>
                    ))}
                    {actionsCell && <td>{actionsCell(item)}</td>}
                  </tr>
                ))}
              </tbody>
            </Table>
            {data && (
              <Group position="center">
                <Pagination
                  mb="md"
                  page={data.pagination.page}
                  onChange={(page) => setParams({ page } as Partial<Request>)}
                  total={Math.ceil(
                    data.pagination.totalItems / data.pagination.pageSize
                  )}
                />
              </Group>
            )}
          </Box>
        );
      }}
    </ApiRender>
  );
};
