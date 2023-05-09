import remove from 'lodash/remove';
import { useEffect } from 'react';

import { Resource } from '../../base';

class ResourceManager {
  store: Record<string, Record<string, any>[]> = {};

  add(resourceName: string, instance: Record<string, any>) {
    let list = this.store[resourceName];
    if (!list) {
      list = [];
      this.store[resourceName] = list;
    }
    const index = list.findIndex((e) => e.id === instance.id);
    if (index > -1) {
      // replace with new resource
      list[index] = instance;
    } else {
      list.push(instance);
    }
  }

  remove(resourceName: string, instance: Record<string, any>) {
    const list = this.store[resourceName];
    if (list) {
      remove(list, (item) => item.id === instance.id);
    }
  }

  get(resourceName: string, id: any) {
    const list = this.store[resourceName];
    return list?.find((item) => item.id === id);
  }
}

export const resourceManager = new ResourceManager();

export function useResource(resource: Resource, instance: Record<string, any>) {
  resourceManager.add(resource.name, instance);

  useEffect(() => {
    return () => {
      resourceManager.remove(resource.name, instance);
    };
  }, []);
}
