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

export type ApiTableColumns<T> = {
  [k in keyof Partial<T>]: {
    title: React.ReactNode;
    render?: (value: T[k], item: T) => React.ReactNode;
  };
};

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
  columns: ApiTableColumns<ResponseItem>;
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
                  {Object.keys(columns).map((key) => (
                    <th key={key}>{columns[key].title}</th>
                  ))}
                  {actionsCell && <th></th>}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item) => (
                  <tr key={item[(rowKey || 'id') as any]}>
                    {Object.entries(columns).map(([key, column]) => (
                      <td key={key}>
                        {column.render
                          ? column.render(item[key], item)
                          : item[key]}
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
