import { inject } from 'inversify';
import { runInTransaction } from 'typeorm-transactional';
import { Api } from '../../base/index.js';
import { autoBind, BaseService } from '../services/base.js';
import { serviceContainer } from '../services/container.js';
import { EventDistributor } from './distributor.js';

interface ServiceItem {
  serviceClass: { new (...args: any[]): BaseService };
  api: Api;
}

@autoBind()
export class ApiSuccessEventManager {
  static items: Array<ServiceItem> = [];

  static makeEvent(api: Api) {
    return `[success][${api.method}]${api.path}`;
  }

  constructor(
    @inject(EventDistributor) protected eventDistributor: EventDistributor
  ) {}

  async registerServices() {
    for (const item of (this.constructor as any).items as ServiceItem[]) {
      const service = await serviceContainer.getAsync(item.serviceClass);
      this.eventDistributor.on(
        (this.constructor as any).makeEvent(item.api),
        (data: any) => {
          runInTransaction(() => {
            return service.handle(data);
          });
        }
      );
    }
  }
}

@autoBind()
export class ApiErrorEventManager extends ApiSuccessEventManager {
  static items: Array<ServiceItem> = [];

  static makeEvent(api: Api) {
    return `[error][${api.method}]${api.path}`;
  }
}
