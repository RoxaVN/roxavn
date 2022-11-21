import { Api, ApiRequest, PaginatedCollection } from '@roxavn/core-share';
import differenceBy from 'lodash/differenceBy';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import {
  VirtualScrollerLazyParams,
  VirtualScrollerProps,
} from 'primereact/virtualscroller';
import { Component } from 'react';

import { apiFetcher } from '../services/api.fetcher';

export interface ApiDropdownProps<Request extends ApiRequest, ResponseItem>
  extends DropdownProps {
  api?: Api<Request & { page: number }, PaginatedCollection<ResponseItem>>;
  apiParams?: Request;
}

type ApiDropdownState = {
  options: any[];
  loading: boolean;
};
class ApiDropdown<Request extends ApiRequest, ResponseItem> extends Component<
  ApiDropdownProps<Request, ResponseItem>,
  ApiDropdownState
> {
  localOptions = [] as any[];
  page = 0;
  itemCount = 0;
  MAX_PAGE = 5;

  constructor(props: ApiDropdownProps<Request, ResponseItem>) {
    super(props);
    let options = [] as any[];
    if (props.options) {
      options = [...props.options];
    }
    if (props.api) {
      this.localOptions = [...options];
      options.push(undefined); // last item to trigget load more
    }
    this.itemCount = options.length;
    this.state = {
      loading: false,
      options,
    };
  }

  fetch = (e: VirtualScrollerLazyParams) => {
    const { api, apiParams, optionValue } = this.props;
    const { loading, options } = this.state;
    const last = (e.last as number) - 1;
    if (
      api &&
      !loading &&
      !options[last] &&
      this.page < this.MAX_PAGE &&
      options.length <= this.itemCount
    ) {
      const params = { page: this.page + 1 };
      apiParams && Object.assign(params, apiParams);
      this.setState({ loading: true });
      apiFetcher
        .fetch(api, params)
        .then((data) => {
          this.page += 1;
          this.setState({ loading: false });
          options.splice(-(1 + this.localOptions.length));
          this.localOptions = differenceBy(
            this.localOptions,
            data.items,
            optionValue || 'value'
          );
          const newOptions = options.concat(data.items, this.localOptions);
          this.itemCount = data.pagination
            ? data.pagination.totalItems
            : newOptions.length;
          if (newOptions.length < this.itemCount) {
            newOptions.push(undefined); // last item to trigget load more
          }
          this.setState({ options: newOptions });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
  };

  render() {
    const { api, onChange, ...dropdownProps } = this.props;
    const { options, loading } = this.state;
    return (
      <Dropdown
        {...dropdownProps}
        onChange={(e) => {
          if (e.target.value === undefined) {
            e.target.value = null;
          }
          onChange && onChange(e);
        }}
        options={options}
        virtualScrollerOptions={
          api &&
          ({
            lazy: true,
            showLoader: true,
            itemSize: 31,
            loading,
            onLazyLoad: this.fetch,
            numToleratedItems: 1,
          } as VirtualScrollerProps)
        }
      />
    );
  }
}

export { ApiDropdown };
