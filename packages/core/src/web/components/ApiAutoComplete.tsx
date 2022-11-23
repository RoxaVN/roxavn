import {
  AutoComplete,
  AutoCompleteChangeParams,
  AutoCompleteProps,
} from 'primereact/autocomplete';
import { useState } from 'react';

import { Api, ApiRequest } from '../../share';
import { apiFetcher } from '../services/api.fetcher';

export interface ApiAutoCompleteProps<Request extends ApiRequest>
  extends AutoCompleteProps {
  api: Api<Request>;
  parseParams?: (params: { query: string }) => Request;
  fieldValue?: string;
}

function ApiAutoComplete<Request extends ApiRequest>({
  api,
  parseParams,
  fieldValue,
  value,
  onChange,
  ...props
}: ApiAutoCompleteProps<Request>) {
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSearch = (event: { query: string }) => {
    apiFetcher
      .fetch(api, parseParams ? parseParams(event) : { query: event.query })
      .then((data) => setItems(data.items));
  };
  const handlechange = (event: AutoCompleteChangeParams) => {
    setSelectedValue(event.value);
    event.value = fieldValue ? event.value[fieldValue] : event.value;
    event.target.value = event.value;
    onChange && onChange(event);
  };

  return (
    <AutoComplete
      value={selectedValue}
      onChange={handlechange}
      suggestions={items}
      completeMethod={handleSearch}
      {...props}
    />
  );
}

export { ApiAutoComplete };
