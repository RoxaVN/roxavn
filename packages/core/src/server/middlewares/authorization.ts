import {
  accessManager,
  Api,
  ForbiddenException,
  Permission,
  Resource,
} from '../../base';
import { AuthenticatedData } from '../service';
import { ServerMiddleware, ServerLoaderArgs } from './interfaces';
import { databaseManager } from '../database';

type AuthorizationMiddleware = (
  args: ServerLoaderArgs & { api: Api & { permission: Permission } }
) => Promise<boolean>;

class AuthorizationManager {
  middlewares: Array<{
    apiMatcher: RegExp;
    priority: number;
    handler: AuthorizationMiddleware;
  }> = [];
}

export const authorizationManager = new AuthorizationManager();

function updateResp({ dbSession, state, api }: ServerLoaderArgs) {
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

  const getResource = async (): Promise<Record<string, any> | null> => {
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

  state.$getResource = getResource;
  state.$getRelateResource = async (resource: Resource) => {
    const activeResource = getActiveResource();
    if (activeResource?.name === resource.name) {
      return await getResource();
    } else {
      const activeResourceData = await getResource();
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
}

export const authorizationMiddleware: ServerMiddleware = async (args) => {
  if (args.api?.permission) {
    updateResp(args);

    for (const middleware of authorizationManager.middlewares
      .concat()
      .sort((a, b) => a.priority - b.priority)) {
      if (middleware.apiMatcher.exec(args.api.path)) {
        if (await middleware.handler(args as any)) {
          return;
        }
      }
    }
    throw new ForbiddenException();
  }
};

// check is auth user
authorizationManager.middlewares.push({
  apiMatcher: /./,
  priority: 1,
  handler: async ({ api }) => {
    const hasScope = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.AuthUser.name
    );
    return hasScope;
  },
});

// check is owner
authorizationManager.middlewares.push({
  apiMatcher: /./,
  priority: 1,
  handler: async ({ api, state }) => {
    const data: AuthenticatedData = state as any;
    const hasOwner = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.Owner.name
    );
    if (hasOwner) {
      if (state[accessManager.scopes.User.idParam] === data.$user.id) {
        return true;
      }
      const resource = await data.$getResource();
      if (
        resource &&
        resource[accessManager.scopes.User.idParam] === data.$user.id
      ) {
        return true;
      }
    }
    return false;
  },
});

// check special resource
authorizationManager.middlewares.push({
  apiMatcher: /./,
  priority: 10,
  handler: async ({ api, state }) => {
    const data: AuthenticatedData = state as any;
    const conditionResources: Resource[] = api.permission.allowedScopes.filter(
      (r) => 'condition' in r
    ) as any;
    for (const resource of conditionResources) {
      if (resource.condition) {
        const relateResource = await data.$getRelateResource(resource);
        if (relateResource) {
          const isValid = resource.condition(relateResource, data);
          if (isValid) {
            return true;
          }
        }
      }
    }
    return false;
  },
});
