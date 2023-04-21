import {
  accessManager,
  Api,
  ForbiddenException,
  Permission,
  Resource,
  UnauthorizedException,
} from '../../base';
import { ServerMiddleware, ServerLoaderContext } from './interfaces';

type AuthorizationMiddleware = (
  context: ServerLoaderContext & { api: Api & { permission: Permission } }
) => Promise<boolean>;

class AuthorizationManager {
  middlewares: Array<{
    apiMatcher: RegExp;
    priority: number;
    handler: AuthorizationMiddleware;
  }> = [];
}

export const authorizationManager = new AuthorizationManager();

export const authorizationMiddleware: ServerMiddleware = async (context) => {
  if (context.api?.permission) {
    for (const middleware of authorizationManager.middlewares
      .concat()
      .sort((a, b) => a.priority - b.priority)) {
      if (middleware.apiMatcher.exec(context.api.path)) {
        if (await middleware.handler(context as any)) {
          return;
        }
      }
    }
    if (context.state.request.$user) {
      throw new ForbiddenException();
    }
    throw new UnauthorizedException();
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
  handler: async ({ api, state, helper }) => {
    const user = state.request.$user;
    const hasOwner = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.Owner.name
    );
    if (hasOwner && user) {
      const userIdParam = accessManager.scopes.User.idParam;
      if (state.request[userIdParam] === user.id) {
        return true;
      }
      const resource = await helper.getResourceInstance();
      if (resource && resource[userIdParam] === user.id) {
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
  handler: async ({ api, state, helper }) => {
    const conditionResources: Resource[] = api.permission.allowedScopes.filter(
      (r) => 'condition' in r
    ) as any;
    for (const resource of conditionResources) {
      if (resource.condition) {
        const relatedResource = await helper.getRelatedResourceInstance(
          resource
        );
        if (relatedResource) {
          const isValid = resource.condition(state, relatedResource);
          if (isValid) {
            return true;
          }
        }
      }
    }
    return false;
  },
});
