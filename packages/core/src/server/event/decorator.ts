import {
  Api,
  ApiRequest,
  ApiResponse,
  InferApiRequest,
  InferApiResponse,
} from '../../base/index.js';
import { databaseManager } from '../database/index.js';
import { BaseService } from '../service.js';
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
          await databaseManager.dataSource.transaction(
            async (entityManager) => {
              return new serviceClass(entityManager).handle(data);
            }
          );
        } catch (e) {
          console.log(e);
        }
      }
    );
  };
}

export type InferOnApiSuccessData<T extends Api> = {
  request: InferApiRequest<T> & { $user?: { id: string } };
  response: InferApiResponse<T>;
};
