import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useLocationHash = (key: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const parts = location.hash.slice(1).split('?');
  let paramsObj = {};
  if (parts[0] === key) {
    paramsObj = Object.fromEntries(new URLSearchParams(parts[1]));
  }

  return {
    params: paramsObj,
    setOnChange: (data: Record<string, any>) => {
      useEffect(() => {
        if (!isEqual(paramsObj, data)) {
          navigate('#' + key + '?' + new URLSearchParams(data).toString());
        }
      }, [data]);
    },
  };
};
