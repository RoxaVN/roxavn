import { Table, Pagination, Group, Stack, Flex, Text } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import React, { MutableRefObject, useState } from 'react';

import { Api, ApiRequest, Collection, PaginatedCollection } from '../../base';
import { useLocationHash } from '../hooks';
import { Reference, webModule } from '../services';
import { ApiFilterButton } from './ApiFilter';
import { ApiForm } from './ApiForm';
import { FormGroupField } from './ApiFormGroup';
import { ActionButton, ActionProps } from './Buttons';
import { ModuleT } from './ModuleT';

export type ApiTableColumns<T> = {
  [k in keyof Partial<T>]: {
    label: React.ReactNode;
    reference?: Reference;
    render?: (value: T[k], item: T) => React.ReactNode;
  };
};

type ApiPaginationRequest = ApiRequest & { page?: number };

type _ActionProps = Omit<ActionProps, 'modalMiddleware'> & {
  autoHandleFormSuccess?: boolean;
  refetchAfterSuccess?: boolean;
};

export type ApiFetcherRef<Request extends ApiPaginationRequest> = {
  fetch: (params: Partial<Request>) => void;
  currentParams: Partial<Request>;
};

export interface ApiTableProps<
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
> {
  api: Api<
    Request,
    PaginatedCollection<ResponseItem> | Collection<ResponseItem>
  >;
  apiParams?: Request;
  locationKey?: string;
  fetcherRef?: MutableRefObject<ApiFetcherRef<Request> | undefined>;
  columns: ApiTableColumns<ResponseItem>;
  filters?: Array<FormGroupField<Request>>;
  itemKey?: keyof ResponseItem;
  header?: React.ReactNode;
  headerActions?:
    | Array<_ActionProps>
    | ((fetcherRef: ApiFetcherRef<Request>) => Array<_ActionProps>);
  cellActions?: (
    item: ResponseItem,
    fetcherRef: ApiFetcherRef<Request>
  ) => Array<_ActionProps>;
}

export const ApiTable = <
  Request extends ApiPaginationRequest,
  ResponseItem extends Record<string, any>
>({
  api,
  apiParams,
  columns,
  filters,
  itemKey,
  header,
  headerActions,
  cellActions,
  fetcherRef,
  locationKey = '/table',
}: ApiTableProps<Request, ResponseItem>) => {
  const hash = useLocationHash(locationKey);
  const [params, setParams] = useState<Partial<Request>>({
    ...hash.params,
    ...apiParams,
  } as Request);
  const references: Record<string, ReturnType<Reference['use']>> = {};
  for (const k in columns) {
    const reference = columns[k].reference;
    if (reference) {
      references[k] = reference.use();
    }
  }
  hash.setOnChange(params);
  useDidUpdate(() => {
    setParams(apiParams || {});
  }, [JSON.stringify(apiParams)]);

  return (
    <ApiForm
      api={api}
      apiParams={params}
      fetchOnMount
      onSuccess={(data) => {
        if (data.items.length) {
          for (const k in references) {
            references[k].setParams({
              ids: data.items.map((item) => item[k]),
            });
          }
        }
      }}
      dataRender={({ data, fetcher }) => {
        const ref = {
          fetch: fetcher,
          currentParams: params,
        };
        if (fetcherRef) {
          fetcherRef.current = ref;
        }
        const parseAction = (
          action: _ActionProps,
          callback: () => void
        ): ActionProps => {
          if (action.autoHandleFormSuccess !== false) {
            return {
              ...action,
              modalMiddleware: (closeModal, modalProps) => {
                if (React.isValidElement(modalProps.children)) {
                  const childProps = modalProps.children.props;
                  modalProps.children = React.cloneElement(
                    modalProps.children,
                    {
                      onSuccess: (...args: any) => {
                        closeModal();
                        showNotification({
                          autoClose: 10000,
                          title: modalProps.title,
                          message: <ModuleT module={webModule} k="success" />,
                          color: 'green',
                          icon: <IconCheck />,
                        });
                        childProps.onSuccess?.apply(modalProps.children, args);
                        if (action.refetchAfterSuccess !== false) {
                          callback();
                        }
                      },
                    } as any
                  );
                }
              },
            };
          } else {
            return action;
          }
        };
        return (
          <Stack>
            <Flex
              justify="space-between"
              direction={{ base: 'column', sm: 'row' }}
              gap="md"
            >
              <Text fz="lg">{header}</Text>
              <Group>
                {filters && (
                  <ApiFilterButton
                    apiParams={params}
                    fields={filters}
                    onApply={(p) => setParams({ ...params, ...p })}
                  />
                )}
                {headerActions &&
                  (typeof headerActions === 'function'
                    ? headerActions(ref)
                    : headerActions
                  ).map((c, index) => (
                    <ActionButton
                      key={index}
                      variant="outline"
                      {...parseAction(c, () => fetcher(apiParams || {}))}
                    />
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
                  <tr key={item[itemKey || 'id']}>
                    {Object.entries(columns).map(([key, column]) => (
                      <td key={key}>
                        {column.reference
                          ? references[key].renderItem(item[key])
                          : column.render
                          ? column.render(item[key], item)
                          : item[key]}
                      </td>
                    ))}
                    {cellActions && (
                      <td>
                        <Group>
                          {cellActions(item, ref).map((c, index) => (
                            <ActionButton
                              key={index}
                              compact
                              variant="subtle"
                              {...parseAction(c, () => fetcher(params))}
                            />
                          ))}
                        </Group>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            {data && 'pagination' in data && (
              <Group position="center">
                <Pagination
                  mb="md"
                  value={data.pagination.page}
                  onChange={(page) =>
                    setParams({ ...params, page } as Partial<Request>)
                  }
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
