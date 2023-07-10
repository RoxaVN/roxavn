import { Api } from '../../base/api.js';
import { ApiSuccessEventManager, EventDistributor } from '../events/index.js';
import { serviceContainer } from './container.js';

export function bindFactory(options?: {
  /**
   * Auto rebind if api success
   */
  api?: Api;
}) {
  return (target: any, propertyKey: string) => {
    const factory = (context: any) => {
      return target[propertyKey](context);
    };

    serviceContainer.bind(target).toDynamicValue(factory);
    if (options?.api) {
      const api = options.api;
      setTimeout(async () => {
        const eventDistributor = await serviceContainer.getAsync(
          EventDistributor
        );
        eventDistributor.on(ApiSuccessEventManager.makeEvent(api), () => {
          serviceContainer.rebind(target).toDynamicValue(factory);
        });
      }, 500);
    }
  };
}
