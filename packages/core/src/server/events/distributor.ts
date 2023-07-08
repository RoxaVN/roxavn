import EventEmitter from 'events';
import { autoBind } from '../services/base.js';

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
}
