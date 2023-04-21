import {
  accessManager,
  Api,
  ForbiddenException,
  Permission,
  Resource,
} from '../../base';
import { AuthenticatedData } from '../service';
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
  handler: async ({ api, state, helper }) => {
    const data: AuthenticatedData = state.request as any;
    const hasOwner = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.Owner.name
    );
    if (hasOwner) {
      if (state[accessManager.scopes.User.idParam] === data.$user.id) {
        return true;
      }
      const resource = await helper.getResourceInstance();
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
