import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { urlUtils } from '../../base';

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
