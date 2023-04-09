import snakeCase from 'lodash/snakeCase';
import {
  accessManager,
  Api,
  ForbiddenException,
  Permission,
  Resource,
} from '../../base';
import { AuthenticatedData } from '../service';
import { ServerMiddleware, MiddlewareContext } from './interfaces';

type AuthorizationMiddleware = (
  context: MiddlewareContext & { api: Api & { permission: Permission } }
) => Promise<boolean>;

class AuthorizationManager {
  middlewares: Array<{
    apiMatcher: RegExp;
    priority: number;
    handler: AuthorizationMiddleware;
  }> = [];
}

export const authorizationManager = new AuthorizationManager();

function updateResp({ dbSession, state, api }: MiddlewareContext) {
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
    if ('$resource' in state) {
      return state.$resource;
    }
    let result = null;
    const resource = getActiveResource();
    if (resource) {
      const resourceTable = snakeCase(resource.name);
      result = await dbSession
        .createQueryBuilder()
        .select(resourceTable)
        .from(resourceTable, resourceTable)
        .where(`${resourceTable}.id = :id`, {
          id: state[resource.idParam],
        })
        .getOne();
    }
    state.$resource = result;
    return result;
  };

  state.$getResource = getResource;
  state.$relateResource = {};
  state.$getRelateResource = async (resource: Resource) => {
    if (resource.name in state.$relateResource) {
      return state.$relateResource[resource.name];
    }
    let result = null;
    const activeResource = getActiveResource();
    if (activeResource?.name === resource.name) {
      result = await getResource();
    } else {
      const activeResourceData = await getResource();
      if (activeResourceData) {
        const relateResourceid = activeResourceData[resource.idParam];
        if (relateResourceid) {
          const resourceTable = snakeCase(resource.name);
          result = await dbSession
            .createQueryBuilder()
            .select(resourceTable)
            .from(resourceTable, resourceTable)
            .where(`${resourceTable}.id = :id`, {
              id: relateResourceid,
            })
            .getOne();
        }
      }
    }

    state.$relateResource[resource.name] = result;
    return result;
  };
}

export const authorizationMiddleware: ServerMiddleware = async (context) => {
  if (context.api?.permission) {
    updateResp(context);

    for (const middleware of authorizationManager.middlewares
      .concat()
      .sort((a, b) => a.priority - b.priority)) {
      if (middleware.apiMatcher.exec(context.api.path)) {
        if (await middleware.handler(context as any)) {
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
