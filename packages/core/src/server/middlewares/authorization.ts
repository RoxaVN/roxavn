import snakeCase from 'lodash/snakeCase';
import {
  accessManager,
  Api,
  ForbiddenException,
  Permission,
  Resource,
} from '../../base';
import { AuthenticatedData } from '../service';
import { ApiMiddleware, MiddlewareContext } from './interfaces';

type AuthorizationMiddleware = (
  api: Api & { permission: Permission },
  context: MiddlewareContext
) => Promise<boolean>;

class AuthorizationManager {
  middlewares: Array<{
    apiMatcher: RegExp;
    handler: AuthorizationMiddleware;
  }> = [];
  customs: Record<string, AuthorizationMiddleware> = {};
}

export const authorizationManager = new AuthorizationManager();

function updateResp(api: Api, { dbSession, resp }: MiddlewareContext) {
  const getActiveResource = () => {
    for (const r of api.resources.reverse()) {
      if (resp.locals[r.idParam]) {
        return r;
      }
    }
    return null;
  };

  const getResource = async (): Promise<Record<string, any> | null> => {
    if ('$resource' in resp.locals) {
      return resp.locals.$resource;
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
          id: resp.locals[resource.idParam],
        })
        .getOne();
    }
    resp.locals.$resource = result;
    return result;
  };

  resp.locals.$getResource = getResource;
  resp.locals.$relateResource = {};
  resp.locals.$getRelateResource = async (resource: Resource) => {
    if (resource.name in resp.locals.$relateResource) {
      return resp.locals.$relateResource[resource.name];
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

    resp.locals.$relateResource[resource.name] = result;
    return result;
  };
}

export const authorizationMiddleware: ApiMiddleware = async (api, context) => {
  if (api.permission) {
    updateResp(api, context);

    if (api.path in authorizationManager.customs) {
      if (await authorizationManager.customs[api.path](api as any, context)) {
        return;
      }
    } else {
      for (const middleware of authorizationManager.middlewares) {
        if (middleware.apiMatcher.exec(api.path)) {
          if (await middleware.handler(api as any, context)) {
            return;
          }
        }
      }
    }
    throw new ForbiddenException();
  }
};

// check is auth user
authorizationManager.middlewares.push({
  apiMatcher: /./,
  handler: async (api) => {
    const hasScope = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.AuthUser.name
    );
    return hasScope;
  },
});

// check is owner
authorizationManager.middlewares.push({
  apiMatcher: /./,
  handler: async (api, { resp }) => {
    const data: AuthenticatedData = resp.locals as any;
    const hasOwner = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.Owner.name
    );
    if (hasOwner) {
      if (resp.locals[accessManager.scopes.User.idParam] === data.$user.id) {
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
  handler: async (api, { resp }) => {
    const data: AuthenticatedData = resp.locals as any;
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
