import { CronJob } from 'cron';
import { runInTransaction } from 'typeorm-transactional';

import { BaseModule } from '../base/module.js';
import { BaseService, autoBind } from './services/base.js';
import { serviceContainer } from './services/container.js';

interface ServiceItem {
  serviceClass: { new (...args: any[]): BaseService };
  module: BaseModule;
  cronTime: string;
  job?: CronJob;
}

@autoBind()
export class CronJobManager {
  static items: Array<ServiceItem> = [];

  async startJobs() {
    for (const item of (this.constructor as any).items as ServiceItem[]) {
      const service = await serviceContainer.getAsync(item.serviceClass);
      item.job = new CronJob(item.cronTime, () => {
        return runInTransaction(async () => {
          try {
            await service.handle();
          } catch (e) {
            console.error(e);
          }
        });
      });
      item.job.start();
    }
  }

  getJob(moduleName: string, serviceName: string) {
    return CronJobManager.items.find(
      (item) =>
        item.module.name === moduleName &&
        item.serviceClass.name === serviceName
    )?.job;
  }
}
