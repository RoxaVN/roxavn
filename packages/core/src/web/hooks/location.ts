import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';

import { constants, urlUtils } from '../../base/index.js';

export const useLocationHash = (key: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const parts = location.hash.slice(1).split('?');
  const paramsObj =
    parts[0] === key && key ? urlUtils.parseQueryStr(parts[1]) : {};

  return {
    params: paramsObj,
    setOnChange: (data: Record<string, any>) => {
      useEffect(() => {
        if (key) {
          const newHash = '#' + key + '?' + urlUtils.generateQueryStr(data);
          if (newHash !== location.hash) {
            navigate(newHash);
          }
        }
      }, [data]);
    },
  };
};

export const useLocationSearch = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams);
  let params = {};
  if (paramsObj[constants.LOCATION_SEARCH_KEY] === key) {
    params = paramsObj;
    delete paramsObj[constants.LOCATION_SEARCH_KEY];
  }

  return {
    params,
    setOnChange: (data: Record<string, any>) => {
      useEffect(() => {
        if (key) {
          setSearchParams({
            ...data,
            [constants.LOCATION_SEARCH_KEY]: key,
          });
        }
      }, [data]);
    },
  };
};
