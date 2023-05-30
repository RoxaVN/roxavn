import { Api, ApiRequest, ApiResponse } from '../../base/index.js';
import { RouterContextState, serviceContainer } from '../service/index.js';
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
        try {
          target[propertyKey](data);
        } catch (e) {
          console.log(e);
        }
      });
    });
  };
}

export type InferOnApiSuccessData<T extends Api> = RouterContextState<T>;
