import {
  Table,
  Pagination,
  Group,
  Button,
  Stack,
  Flex,
  Text,
} from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import React, { MutableRefObject } from 'react';

import { Api, ApiRequest, PaginatedCollection } from '../../share';
import { ApiFilterButton } from './ApiFilter';
import { ApiForm } from './ApiForm';

export type ApiTableColumns<T> = {
  [k in keyof Partial<T>]: {
    label: React.ReactNode;
    filterInput?: React.ReactNode;
    render?: (value: T[k], item: T) => React.ReactNode;
  };
};

interface TableHeaderAction<Request extends ApiPaginationRequest> {
  label: string;
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  onClick: (fetcherRef: ApiFetcherRef<Request>) => void;
}

interface TableCellAction<
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
> extends Omit<TableHeaderAction<Request>, 'onClick'> {
  onClick: (item: ResponseItem, fetcherRef: ApiFetcherRef<Request>) => void;
}

type ApiPaginationRequest = ApiRequest & { page: number };

export type ApiFetcherRef<Request extends ApiPaginationRequest> = {
  fetch: (params: Request) => void;
  currentParams: Request;
};

export interface ApiTableProps<
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
> {
  api: Api<Request, PaginatedCollection<ResponseItem>>;
  apiParams?: Request;
  fetcherRef?: MutableRefObject<ApiFetcherRef<Request> | undefined>;
  columns: ApiTableColumns<ResponseItem>;
  rowKey?: keyof ResponseItem;
  header?: React.ReactNode;
  headerActions?: Array<TableHeaderAction<Request>>;
  cellActions?: Array<TableCellAction<Request, ResponseItem>>;
}

export const ApiTable = <
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
>({
  api,
  apiParams,
  columns,
  rowKey,
  header,
  headerActions,
  cellActions,
  fetcherRef,
}: ApiTableProps<Request, ResponseItem>) => {
  const [params, setParams] = useSetState<Request>(
    apiParams || ({ page: 1 } as Request)
  );

  const renderFilterButton = () => {
    const filters: any = {};
    Object.keys(columns)
      .filter((k) => columns[k].filterInput)
      .map((k) => {
        filters[k] = columns[k];
      });
    return Object.keys(filters).length ? (
      <ApiFilterButton
        api={api}
        filters={filters}
        onApply={(p) => setParams(p)}
      />
    ) : null;
  };

  return (
    <ApiForm
      api={api}
      apiParams={params}
      fetchOnMount
      dataRender={({ data, fetcher }) => {
        const ref = {
          fetch: fetcher,
          currentParams: params,
        };
        if (fetcherRef) {
          fetcherRef.current = ref;
        }
        return (
          <Stack>
            <Flex
              justify="space-between"
              direction={{ base: 'column', sm: 'row' }}
              gap="md"
            >
              <Text fz="lg">{header}</Text>
              <Group>
                {renderFilterButton()}
                {headerActions?.map((c) => (
                  <Button
                    key={c.label}
                    variant="outline"
                    leftIcon={c.icon && <c.icon size={16} />}
                    onClick={() => c.onClick(ref)}
                  >
                    {c.label}
                  </Button>
                ))}
              </Group>
            </Flex>
            <Table mb="md">
              <thead>
                <tr>
                  {Object.keys(columns).map((key) => (
                    <th key={key}>{columns[key].label}</th>
                  ))}
                  {cellActions && <th></th>}
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
                    {cellActions && (
                      <td>
                        <Group>
                          {cellActions.map((c) => (
                            <Button
                              compact
                              variant="subtle"
                              key={c.label}
                              leftIcon={c.icon && <c.icon size={16} />}
                              onClick={() => c.onClick(item, ref)}
                            >
                              {c.label}
                            </Button>
                          ))}
                        </Group>
                      </td>
                    )}
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
          </Stack>
        );
      }}
    />
  );
};
