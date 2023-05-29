import {
  Api,
  ApiRequest,
  ApiResponse,
  InferApiRequest,
  InferApiResponse,
} from '../../base/index.js';
import { BaseService, serviceContainer } from '../service/index.js';
import { eventManager } from './manager.js';

export function onApiSuccess<Req extends ApiRequest, Resp extends ApiResponse>(
  api: Api<Req, Resp>
) {
  return (serviceClass: {
    new (...args: any[]): BaseService<{ request: Req; response: Resp }, any>;
  }) => {
    eventManager.distributor.on(
      eventManager.makeApiSuccessEvent(api),
      async (data) => {
        try {
          const service = await serviceContainer.getAsync(serviceClass);
          service.handle(data);
        } catch (e) {
          console.log(e);
        }
      }
    );
  };
}

export type InferOnApiSuccessData<T extends Api> = {
  request: InferApiRequest<T>;
  response: InferApiResponse<T>;
};
