import uniqBy from 'lodash/uniqBy';
import { Permission, Resource } from './access';
import { Api } from './api';

export type AuthorizationArgs = {
  api: Api;
  request: Record<string, any>;
  helper: {
    getResourceInstance: () => Promise<Record<string, any> | null>;
    getRelatedResourceInstance: (
      resource: Resource
    ) => Promise<Record<string, any> | null>;
    hasPermission: (
      userId: string,
      permission: string,
      scopes: Array<{ name: string; id?: string }>
    ) => Promise<boolean>;
  };
};

type AuthorizationMiddleware = (
  args: AuthorizationArgs & { api: Api & { permission: Permission } }
) => Promise<boolean>;

class AuthorizationManager {
  middlewares: Array<{
    priority: number;
    handler: AuthorizationMiddleware;
  }> = [];
}

export const authorizationManager = new AuthorizationManager();

export const authorize = async (args: AuthorizationArgs) => {
  if (args.api?.permission) {
    for (const middleware of authorizationManager.middlewares
      .concat()
      .sort((a, b) => a.priority - b.priority)) {
      if (await middleware.handler(args as any)) {
        return true;
      }
    }
    return false;
  }
  return true;
};

// check special resource
authorizationManager.middlewares.push({
  priority: 1,
  handler: async ({ api, request, helper }) => {
    const conditionResources: Resource[] = api.permission.allowedScopes.filter(
      (r) => 'condition' in r
    ) as any;
    for (const resource of conditionResources) {
      if (resource.condition) {
        const relatedResource = await helper.getRelatedResourceInstance(
          resource
        );
        if (relatedResource) {
          const isValid = resource.condition(request, relatedResource);
          if (isValid) {
            return true;
          }
        }
      }
    }
    return false;
  },
});

// check permission
authorizationManager.middlewares.push({
  priority: 2,
  handler: async ({ api, request, helper }) => {
    const user = request.$user;
    if (user) {
      const resource = await helper.getResourceInstance();
      let scopes = api.permission.allowedScopes
        .filter((s) => !s.condition)
        .map((s) => ({
          name: s.dynamicName ? s.dynamicName(request) : s.name,
          id:
            s.idParam &&
            (request[s.idParam] || (resource && resource[s.idParam])),
        }));

      if (scopes.length) {
        scopes = uniqBy(scopes, (item) => item.name);
        return await helper.hasPermission(user.id, api.permission.name, scopes);
      }
    }
    return false;
  },
});
