import { Resource } from '../../base';
import { databaseManager } from '../database';
import { RemixLoaderContextHelper, ServerLoaderContext } from './interfaces';

export function makeContextHelper(
  remixContextHelper: RemixLoaderContextHelper,
  {
    dbSession,
    api,
    state,
  }: Pick<ServerLoaderContext, 'dbSession' | 'api' | 'state'>
) {
  const getActiveResource = () => {
    if (api) {
      for (const r of api.resources.reverse()) {
        if (state[r.idParam]) {
          return r;
        }
      }
    }
    return null;
  };

  const getResourceInstance = async (): Promise<Record<string, any> | null> => {
    const resource = getActiveResource();
    if (resource) {
      const entity = databaseManager.getEntity(resource.name);
      const resourceId = state[resource.idParam];
      return await dbSession.getRepository(entity).findOne({
        where: { id: resourceId },
        cache: true,
      });
    }
    return null;
  };

  const getRelatedResourceInstance = async (resource: Resource) => {
    const activeResource = getActiveResource();
    if (activeResource?.name === resource.name) {
      return await getResourceInstance();
    } else {
      const activeResourceData = await getResourceInstance();
      if (activeResourceData) {
        const relateResourceid = activeResourceData[resource.idParam];
        if (relateResourceid) {
          const entity = databaseManager.getEntity(resource.name);
          return await dbSession.getRepository(entity).findOne({
            where: { id: relateResourceid },
            cache: true,
          });
        }
      }
    }
    return null;
  };

  return {
    ...remixContextHelper,
    getResourceInstance,
    getRelatedResourceInstance,
  };
}
