import { runInTransaction } from 'typeorm-transactional';
import { Api, ApiRequest, ApiResponse } from '../../base/index.js';
import { RouterContextState, serviceContainer } from '../services/index.js';
import { EventDistributor, makeApiSuccessEvent } from './distributor.js';

export function onApiSuccess<Req extends ApiRequest, Resp extends ApiResponse>(
  api: Api<Req, Resp>
) {
  return (target: any, propertyKey: string) => {
    setTimeout(async () => {
      const eventDistributor = await serviceContainer.getAsync(
        EventDistributor
      );
      eventDistributor.on(makeApiSuccessEvent(api), async (data) => {
        runInTransaction(() => {
          return target[propertyKey](data);
        });
      });
    });
  };
}

export type InferOnApiSuccessData<T extends Api> = RouterContextState<T>;
