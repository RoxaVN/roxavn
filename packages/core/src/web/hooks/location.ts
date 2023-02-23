import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useLocationSearch = (key?: string) => {
  const [params, setParams] = useSearchParams();
  let paramsObj = Object.fromEntries(params);
  if (key && params.get('_k') !== key) {
    paramsObj = {};
  }
  return {
    params: paramsObj,
    setOnChange: (data: Record<string, any>) => {
      useEffect(() => {
        setParams(key ? { ...data, _k: key } : data);
      }, [data]);
    },
  };
};
