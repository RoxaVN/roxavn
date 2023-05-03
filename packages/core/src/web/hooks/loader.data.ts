import type { TypedResponse } from '@remix-run/node';
import { useLoaderData as useLoaderDataRemix } from '@remix-run/react';
import cloneDeepWith from 'lodash/cloneDeepWith';

import { urlUtils } from '../../base';

type InferLoaderData<T> = T extends (...args: any[]) => infer Output
  ? Awaited<Output> extends TypedResponse<infer U>
    ? U
    : Awaited<Output>
  : Awaited<T>;

type InferDeserialize<T> = T extends { json: any } ? T['json'] : unknown;

export function useLoaderData<T>(): InferDeserialize<InferLoaderData<T>> {
  const data = useLoaderDataRemix();
  return cloneDeepWith(data, (value) => {
    const parsed = urlUtils.parseValue(value);
    return parsed === value ? undefined : parsed;
  });
}
