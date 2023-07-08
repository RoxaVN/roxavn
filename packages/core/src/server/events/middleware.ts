import { MiddlewareService } from '../middlewares/interfaces.js';
import { useApiMiddleware } from '../middlewares/manager.js';
import { serviceContainer } from '../services/container.js';
import { RouterContext } from '../services/context.js';
import { EventDistributor } from './distributor.js';
import { ApiErrorEventManager, ApiSuccessEventManager } from './manager.js';

@useApiMiddleware()
export class EmitApiEventMiddleware implements MiddlewareService {
  async handle({ api, state }: RouterContext, next: () => Promise<void>) {
    const eventDistributor = await serviceContainer.getAsync(EventDistributor);
    try {
      await next();
      if (api) {
        setTimeout(async () => {
          eventDistributor.emit(ApiSuccessEventManager.makeEvent(api), state);
        }, 50);
      }
    } catch (error) {
      if (api) {
        setTimeout(async () => {
          eventDistributor.emit(ApiErrorEventManager.makeEvent(api), {
            ...state,
            error,
          });
        }, 50);
        // re-throw for other middleware
        throw error;
      }
    }
  }
}
