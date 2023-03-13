import { accessManager, Api, ForbiddenException, Permission } from '../../base';
import { AuthenticatedData } from '../auth';
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

export const authorizationMiddleware: ApiMiddleware = async (api, context) => {
  if (api.permission) {
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
