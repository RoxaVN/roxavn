import { LoadingOverlay, Table, Pagination, Group, Box } from '@mantine/core';
import { useState } from 'react';

import { Api, ApiRequest, PaginatedCollection } from '../../share';
import { ApiRender } from './ApiRender';

export interface ApiTableColumn<T, K extends keyof T> {
  key: K;
  title: React.ReactNode;
  render?: (value: T[K], item: T) => React.ReactNode;
}

export interface ApiTable<
  Request extends ApiRequest & { page: number },
  ResponseItem extends Record<string, any>
> {
  api: Api<Request, PaginatedCollection<ResponseItem>>;
  apiParams?: Request;
  columns: Array<ApiTableColumn<ResponseItem, keyof ResponseItem>>;
  keyColumnName?: keyof ResponseItem;
  rowActions?: (item: ResponseItem) => React.ReactNode;
}

export const ApiTable = <
  Request extends ApiRequest & { page: number },
  ResponseItem extends Record<string, any>
>({
  api,
  apiParams,
  columns,
  keyColumnName,
  rowActions,
}: ApiTable<Request, ResponseItem>) => {
  const [page, setPage] = useState(1);

  return (
    <ApiRender api={api} apiParams={{ ...apiParams, page }}>
      {({ data, loading }) => (
        <Box sx={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} />
          <Table mb="md">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key as string}>{column.title}</th>
                ))}
                {rowActions && <th></th>}
              </tr>
            </thead>
            <tbody>
              {data?.items.map((item) => (
                <tr key={item[(keyColumnName || 'id') as any]}>
                  {columns.map((column) => (
                    <td key={column.key as string}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : (item[column.key] as any)}
                    </td>
                  ))}
                  {rowActions && <td>{rowActions(item)}</td>}
                </tr>
              ))}
            </tbody>
          </Table>
          {data && (
            <Group position="center">
              <Pagination
                mb="md"
                page={page}
                onChange={setPage}
                total={Math.ceil(
                  data.pagination.totalItems / data.pagination.pageSize
                )}
              />
            </Group>
          )}
        </Box>
      )}
    </ApiRender>
  );
};
