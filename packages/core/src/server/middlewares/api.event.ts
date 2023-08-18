import { serviceContainer } from '../services/container.js';
import { RouterContext } from '../services/context.js';
import { EventDistributor } from '../events/distributor.js';
import {
  ApiErrorEventManager,
  ApiSuccessEventManager,
} from '../events/manager.js';
import { serverModule } from '../module.js';
import { MiddlewareService } from '../middleware.js';

@serverModule.useApiMiddleware()
export class EmitApiEventMiddleware implements MiddlewareService {
  async handle({ api, state }: RouterContext, next: () => Promise<void>) {
    const eventDistributor = await serviceContainer.getAsync(EventDistributor);
    try {
      await next();
      if (api) {
        setTimeout(() => {
          eventDistributor.emit(ApiSuccessEventManager.makeEvent(api), state);
        }, 50);
      }
    } catch (error) {
      if (api) {
        setTimeout(() => {
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
