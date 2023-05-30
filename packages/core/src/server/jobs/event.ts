import { Api } from '../../base/api.js';
import {
  EventDistributor,
  makeApiSuccessEvent,
} from '../events/distributor.js';
import { BaseService, autoBind } from '../services/base.js';
import { serviceContainer } from '../services/container.js';

export function useApiEventJob(api: Api) {
  return (serviceClass: { new (...args: any[]): BaseService }) => {
    autoBind()(serviceClass);
    EventJobManager.items.push({ serviceClass, api });
  };
}

@autoBind()
export class EventJobManager {
  static items: Array<{
    serviceClass: { new (...args: any[]): BaseService };
    api: Api;
  }> = [];

  async registerServices() {
    const eventDistributor = await serviceContainer.getAsync(EventDistributor);
    for (const item of EventJobManager.items) {
      const service = await serviceContainer.getAsync(item.serviceClass);
      eventDistributor.on(makeApiSuccessEvent(item.api), (data: any) => {
        service.handle(data);
      });
    }
  }
}
