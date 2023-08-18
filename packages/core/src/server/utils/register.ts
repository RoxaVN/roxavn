import { CronJobManager } from '../cron.job.js';
import {
  ApiErrorEventManager,
  ApiSuccessEventManager,
} from '../events/manager.js';
import { ApiErrorJobManager, ApiSuccessJobManager } from '../jobs/manager.js';
import { serviceContainer } from '../services/container.js';

export async function registerServices() {
  await (
    await serviceContainer.getAsync(ApiSuccessEventManager)
  ).registerServices();
  await (
    await serviceContainer.getAsync(ApiErrorEventManager)
  ).registerServices();

  if (process.env.RUN_API_JOBS) {
    await (
      await serviceContainer.getAsync(ApiSuccessJobManager)
    ).registerServices();
    await (
      await serviceContainer.getAsync(ApiErrorJobManager)
    ).registerServices();
  }

  if (process.env.RUN_CRON_JOBS) {
    await (await serviceContainer.getAsync(CronJobManager)).registerServices();
  }
}
