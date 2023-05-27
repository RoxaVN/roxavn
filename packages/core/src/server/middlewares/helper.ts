import { inject } from 'inversify';
import { Api, Resource } from '../../base/index.js';
import { databaseManager, DatabaseService } from '../database/index.js';
import { autoBind } from '../service/base.js';

@autoBind()
export class ResourceService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService
  ) {}

  getActiveResource = (api: Api, state: Record<string, any>) => {
    if (api) {
      for (const r of api.resources.reverse()) {
        if (state.request?.[r.idParam]) {
          return r;
        }
      }
    }
    return null;
  };

  getResourceInstance = async (
    api: Api,
    state: Record<string, any>
  ): Promise<Record<string, any> | null> => {
    const resource = this.getActiveResource(api, state);
    if (resource) {
      const entity = databaseManager.getEntity(resource.name);
      const resourceId = state.request[resource.idParam];
      return await this.databaseService.manager.getRepository(entity).findOne({
        where: { id: resourceId },
        cache: true,
      });
    }
    return null;
  };

  getRelatedResourceInstance = async (
    api: Api,
    state: Record<string, any>,
    resource: Resource
  ) => {
    const activeResource = this.getActiveResource(api, state);
    if (activeResource?.name === resource.name) {
      return await this.getResourceInstance(api, state);
    } else {
      const activeResourceData = await this.getResourceInstance(api, state);
      if (activeResourceData) {
        const relateResourceid = activeResourceData[resource.idParam];
        if (relateResourceid) {
          const entity = databaseManager.getEntity(resource.name);
          return await this.databaseService.manager
            .getRepository(entity)
            .findOne({
              where: { id: relateResourceid },
              cache: true,
            });
        }
      }
    }
    return null;
  };
}
