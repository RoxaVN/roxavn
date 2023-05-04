import type { TypedResponse } from '@remix-run/node';
import { useLoaderData as useLoaderDataRemix } from '@remix-run/react';
import cloneDeepWith from 'lodash/cloneDeepWith';

import { urlUtils } from '../../base';

type InferLoaderData<T> = T extends (...args: any[]) => infer Output
  ? Awaited<Output> extends TypedResponse<infer U>
    ? U
    : Awaited<Output>
  : Awaited<T>;

export function useLoaderData<T>(): InferLoaderData<T> {
  const data = useLoaderDataRemix();
  return cloneDeepWith(data, (value, key) => {
    if (key) {
      const parsed = urlUtils.parseValue(key.toString(), value);
      return parsed === value ? undefined : parsed;
    }
  });
}
