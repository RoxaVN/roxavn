import EventEmitter from 'events';
import { Api } from '../../base/index.js';
import { autoBind } from '../service/base.js';
import { useApiMiddleware, MiddlewareService } from '../middlewares/index.js';
import { RouterContext, serviceContainer } from '../service/index.js';

@autoBind()
export class EventDistributor {
  private emiter = new EventEmitter();

  on(event: string, handler: (data: any) => void) {
    this.emiter.on(event, handler);
  }
  emit(event: string, data: any) {
    this.emiter.emit(event, data);
  }
}

export function makeApiSuccessEvent(api: Api) {
  return `[success][${api.method}]${api.path}`;
}

export function makeApiErrorEvent(api: Api) {
  return `[error][${api.method}]${api.path}`;
}

@useApiMiddleware()
export class EmitApiEventMiddleware implements MiddlewareService {
  async handle({ api, state }: RouterContext, next: () => Promise<void>) {
    await next();
    if (api) {
      const eventDistributor = await serviceContainer.getAsync(
        EventDistributor
      );
      eventDistributor.emit(makeApiSuccessEvent(api), state);
    }
  }
}
