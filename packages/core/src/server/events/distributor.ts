import EventEmitter from 'events';
import { Api } from '../../base/index.js';
import { autoBind } from '../services/base.js';
import { useApiMiddleware, MiddlewareService } from '../middlewares/index.js';
import { RouterContext, serviceContainer } from '../services/index.js';

@autoBind()
export class EventDistributor {
  private emiter = new EventEmitter();

  on(event: string, handler: (data: any) => void | Promise<void>) {
    this.emiter.on(event, async (data: any) => {
      try {
        await handler(data);
      } catch (e) {
        console.error(e);
      }
    });
  }
  emit(event: string, data: any) {
    this.emiter.emit(event, data);
  }

  handleJob(jobName: string, handler: (data: any) => void | Promise<void>) {
    this.on(jobName, handler);
  }

  pushJob(jobName: string, data: any) {
    this.emit(jobName, data);
  }
}

export function makeApiJobName(api: Api) {
  return `[job][${api.method}]${api.path}`;
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
      setTimeout(async () => {
        try {
          const eventDistributor = await serviceContainer.getAsync(
            EventDistributor
          );
          eventDistributor.emit(makeApiSuccessEvent(api), state);
          eventDistributor.pushJob(makeApiJobName(api), state);
        } catch (e) {
          console.error(e);
        }
      }, 50);
    }
  }
}
