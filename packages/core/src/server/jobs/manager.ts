import { inject } from 'inversify';
import { runInTransaction } from 'typeorm-transactional';
import { Api } from '../../base/index.js';
import { autoBind, BaseService } from '../services/base.js';
import { serviceContainer } from '../services/container.js';
import { JobDistributor } from './distributor.js';

interface ServiceItem {
  serviceClass: {
    new (...args: any[]): BaseService;
  };
  api: Api;
}

@autoBind()
export class ApiSuccessJobManager {
  static items: Array<ServiceItem> = [];

  static makeEvent(item: ServiceItem) {
    return `[success][${item.serviceClass.name}][${item.api.method}]${item.api.path}`;
  }

  static filter(api: Api) {
    return this.items.filter(
      (item) => item.api.path === api.path && item.api.method === api.method
    );
  }

  static push(serviceItem: ServiceItem) {
    if (
      this.items.find(
        (item) =>
          item.serviceClass.name === serviceItem.serviceClass.name &&
          item.api === serviceItem.api
      )
    ) {
      throw new Error(
        `[${this.name}] service ${serviceItem.serviceClass.name} already existed`
      );
    }
    this.items.push(serviceItem);
  }

  constructor(
    @inject(JobDistributor) protected jobDistributor: JobDistributor
  ) {}

  async registerServices() {
    for (const item of (this.constructor as any).items as ServiceItem[]) {
      const service = await serviceContainer.getAsync(item.serviceClass);
      this.jobDistributor.on(
        (this.constructor as any).makeEvent(item),
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
export class ApiErrorJobManager extends ApiSuccessJobManager {
  static items: Array<ServiceItem> = [];

  static makeEvent(item: ServiceItem) {
    return `[error][${item.serviceClass.name}][${item.api.method}]${item.api.path}`;
  }
}
