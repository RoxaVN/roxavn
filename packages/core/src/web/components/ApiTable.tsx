import { Table, Pagination, Group, Flex, Input } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import React, { MutableRefObject } from 'react';

import {
  Api,
  ApiRequest,
  InferApiRequest,
  PaginatedCollection,
} from '../../share';
import { ApiFilterIcons } from './ApiFilterInput';
import { ApiForm } from './ApiForm';

export type ApiTableColumns<T> = {
  [k in keyof Partial<T>]: {
    title: React.ReactNode;
    render?: (value: T[k], item: T) => React.ReactNode;
  };
};

export type ApiTableFilters<T> = {
  [k in keyof Partial<T>]: React.ReactElement;
};

type ApiPaginationRequest = ApiRequest & { page: number };

export type ApiFetcherRef<T extends Api<ApiPaginationRequest>> = {
  fetch: (params: InferApiRequest<T>) => void;
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
  filters?: ApiTableFilters<ResponseItem>;
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
  filters,
  actionsCell,
  fetcherRef,
}: ApiTable<Request, ResponseItem>) => {
  const [params, setParams] = useSetState<Request>(
    apiParams || ({ page: 1 } as Request)
  );

  return (
    <ApiForm
      api={api}
      apiParams={params}
      fetchOnMount
      formRender={
        filters &&
        ((form) => {
          const filtersValidator = (api.validator as any).__filters__ || {};

          return (
            <Flex
              justify="flex-start"
              align="start"
              direction="row"
              gap="md"
              wrap="wrap"
            >
              {Object.entries(filters).map(([key, value]) => {
                const props: any = form.getInputProps(key);
                props.key = key;
                const filter = filtersValidator[key];
                if (filter.length === 1) {
                  props.icon = ApiFilterIcons[filter[0]];
                  props.value = (props.value || '').replace(
                    filter[0] + ':',
                    ''
                  );
                  const orgOnChange = props.onChange;
                  props.onChange = (e: any) => {
                    e.target.value = filter[0] + ':' + e.target.value;
                    orgOnChange(e);
                  };
                }
                return React.cloneElement(value, props);
              })}
              <Input.Wrapper label="&nbsp;">
                <Input
                  type="submit"
                  children="Search"
                  component="button"
                  icon={<IconSearch size={16} />}
                />
              </Input.Wrapper>
            </Flex>
          );
        })
      }
      dataRender={({ data, fetcher }) => {
        if (fetcherRef) {
          fetcherRef.current = {
            fetch: fetcher,
            currentParams: params,
          };
        }
        return (
          <div>
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
          </div>
        );
      }}
    />
  );
};
