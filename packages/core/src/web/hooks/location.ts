import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useLocationSearch = (key?: string) => {
  const [params, setParams] = useSearchParams();
  const { _k, ...paramsObj } = Object.fromEntries(params);
  if (key && _k !== key) {
    Object.keys(paramsObj).forEach((attr) => delete paramsObj[attr]);
  }
  return {
    params: paramsObj,
    setOnChange: (data: Record<string, any>) => {
      useEffect(() => {
        if (!isEqual(paramsObj, data)) {
          // react-router still refresh page with _data=root
          // https://github.com/remix-run/react-router/discussions/9851
          setParams(key ? { ...data, _k: key } : data);
        }
      }, [data]);
    },
  };
};
