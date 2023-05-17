import EventEmitter from 'events';
import { Api } from '../../base';

export interface EventDistributor {
  on: (event: string, handler: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
}

class EventManager {
  distributorFactory: new (...args: any[]) => EventDistributor = EventEmitter;
  distributor!: EventDistributor;

  init() {
    this.distributor = new this.distributorFactory();
    return this;
  }

  makeApiSuccessEvent(api: Api) {
    return `[success]${api.path}`;
  }
  makeApiErrorEvent(api: Api) {
    return `[error]${api.path}`;
  }
}

export const eventManager = new EventManager().init();
