import { serviceContainer } from '../services/container.js';
import { RouterContext } from '../services/context.js';
import {
  ApiErrorJobManager,
  ApiSuccessJobManager,
  JobDistributor,
} from '../jobs/index.js';
import { serverModule } from '../module.js';
import { MiddlewareService } from '../middleware.js';

@serverModule.useApiMiddleware()
export class EmitApiJobMiddleware implements MiddlewareService {
  async handle({ api, state }: RouterContext, next: () => Promise<void>) {
    const jobDistributor = await serviceContainer.getAsync(JobDistributor);
    try {
      await next();
      if (api) {
        setTimeout(() => {
          ApiSuccessJobManager.filter(api).forEach((item) => {
            jobDistributor.emit(ApiSuccessJobManager.makeEvent(item), state);
          });
        }, 50);
      }
    } catch (error) {
      if (api) {
        setTimeout(() => {
          ApiErrorJobManager.filter(api).forEach((item) => {
            jobDistributor.emit(ApiErrorJobManager.makeEvent(item), {
              ...state,
              error,
            });
          });
        }, 50);
        // re-throw for other middleware
        throw error;
      }
    }
  }
}
