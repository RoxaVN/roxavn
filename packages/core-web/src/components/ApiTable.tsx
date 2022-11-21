import { Api, ApiRequest, PaginatedCollection } from '@roxavn/core-share';
import { localeOption } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnProps } from 'primereact/column';
import { DataTable, DataTableProps } from 'primereact/datatable';
import React, { Component } from 'react';

import { ApiForm, FieldItemProps } from './ApiForm';
import { apiFetcher } from '../services/api.fetcher';
import { utils } from '../services/utils';
import { uiManager } from '../services/ui';

interface ColumnPropsEx<ResponseItem> extends Omit<ColumnProps, 'body'> {
  field: string;
  body?: (data: any, rowData: ResponseItem) => React.ReactNode;
}

export interface ApiTableProps<Request extends ApiRequest, ResponseItem>
  extends DataTableProps {
  api: Api<Request, PaginatedCollection<ResponseItem>>;
  apiParams?: Request;
  onGetSuccess?: (data: PaginatedCollection<ResponseItem>) => void;
  columns: Array<ColumnPropsEx<ResponseItem>>;
  actionsColumn?: (rowData: ResponseItem) => React.ReactNode[];
  searchFields?: Array<FieldItemProps>;
  parseSearchParams?: (params: Partial<Request>) => Request;
  headerTitle?: React.ReactNode;
  actions?: Array<React.ReactNode>;
}

class ApiTable<
  Request extends ApiRequest = ApiRequest,
  ResponseItem = any
> extends Component<ApiTableProps<Request, ResponseItem>> {
  state = {
    items: [],
    loading: false,
    pagination: {},
  };
  params = {};
  currentPage = 1;

  componentDidMount() {
    const { apiParams } = this.props;
    this.params = { ...(apiParams || {}) };
    this.fetch(1);
  }

  fetch(page?: number) {
    const { api } = this.props;
    this.currentPage = page || this.currentPage;
    const params: ApiRequest = { page: this.currentPage };
    Object.assign(params, this.params);
    this.setState({ loading: true });
    apiFetcher
      .fetch(api, params)
      .then((data) => {
        this.setState({ loading: false });
        this.updateStateFromResp(data);
      })
      .catch((resp: any) => {
        this.setState({ loading: false });
        const error = apiFetcher.getErrorData(resp);
        if (error) {
          uiManager.errorDialog(error);
        }
      });
  }

  private updateStateFromResp(data: PaginatedCollection<any>) {
    const { onGetSuccess } = this.props;
    if (onGetSuccess) {
      onGetSuccess(data);
    }
    const { pagination, items } = data;
    this.setState({
      items: items,
      pagination: pagination && {
        lazy: true,
        first: (pagination.page - 1) * pagination.pageSize,
        paginator: true,
        totalRecords: pagination.totalItems,
        rows: pagination.pageSize,
        onPage: (e: any) => this.fetch(e.page + 1),
        paginatorTemplate: {
          layout:
            'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
          CurrentPageReport: (options: any) => (
            <span className="mx-3" style={{ color: 'var(--text-color)' }}>
              {utils.Render.number(options.first)} -{' '}
              {utils.Render.number(options.last)}{' '}
              {localeOption('ofTotal', '')?.toLowerCase()}{' '}
              {utils.Render.number(options.totalRecords)}
            </span>
          ),
        },
      },
    });
  }

  private renderHeader() {
    const { title, actions, searchFields, parseSearchParams, api, apiParams } =
      this.props;
    return (
      (title || actions || searchFields) && (
        <div>
          <div className="mb-2 flex justify-content-between">
            <h5>{title || ' '}</h5>
            {actions && (
              <div>
                {actions.map((action, index) => (
                  <span key={index} className="mr-2">
                    {action}
                  </span>
                ))}
              </div>
            )}
          </div>
          {searchFields && (
            <ApiForm
              api={api}
              type="inline"
              fields={searchFields}
              fieldsValue={apiParams}
              parseParams={(params) => {
                const newParams = parseSearchParams
                  ? parseSearchParams(params)
                  : params;
                this.params = { ...apiParams, ...newParams };
                Object.assign(newParams, this.params);
                return newParams as Request & { page: number };
              }}
              renderFooter={() => (
                <Button
                  icon="pi pi-search"
                  label={localeOption('search', '')}
                />
              )}
              onSuccess={(resp) => this.updateStateFromResp(resp)}
            />
          )}
        </div>
      )
    );
  }
  render() {
    const {
      api, // eslint-disable-line @typescript-eslint/no-unused-vars
      apiParams, // eslint-disable-line @typescript-eslint/no-unused-vars
      columns,
      onGetSuccess, // eslint-disable-line @typescript-eslint/no-unused-vars
      searchFields, // eslint-disable-line @typescript-eslint/no-unused-vars
      actionsColumn,
      parseSearchParams, // eslint-disable-line @typescript-eslint/no-unused-vars
      headerTitle, // eslint-disable-line @typescript-eslint/no-unused-vars
      actions, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...tableProps
    } = this.props;
    const { items, loading, pagination } = this.state;
    return (
      <DataTable
        {...tableProps}
        header={this.renderHeader()}
        value={items}
        loading={loading}
        emptyMessage={localeOption('emptyMessage', '')}
        {...pagination}
      >
        {columns.map(({ field, body, ...column }) => (
          <Column
            key={field}
            {...column}
            body={(rowData) =>
              body ? body(rowData[field], rowData) : rowData[field]
            }
          />
        ))}
        {actionsColumn && (
          <Column
            key="_actions"
            header={localeOption('actions', '')}
            body={(rowData) => (
              <div className="actions-cell">
                {actionsColumn(rowData).map((action, index) => (
                  <div key={index} className="mx-1 inline-block">
                    {action}
                  </div>
                ))}
              </div>
            )}
          />
        )}
      </DataTable>
    );
  }
}

export { ApiTable };
