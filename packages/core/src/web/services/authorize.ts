import { uniqBy } from 'lodash-es';
import { Permission, Resource, Api } from '../../base/index.js';

export type AuthorizationArgs = {
  api: Api;
  request: Record<string, any>;
  helper: {
    getResourceInstance: () => Record<string, any> | undefined;
    getRelatedResourceInstance: (
      resource: Resource
    ) => Record<string, any> | undefined;
    hasPermission: (
      userId: string,
      permission: string,
      scopes: Array<{ name: string; id?: string }>
    ) => boolean;
  };
};

type AuthorizationMiddleware = (
  args: AuthorizationArgs & { api: Api & { permission: Permission } }
) => boolean;

const middlewares: Array<AuthorizationMiddleware> = [
  ({ api, request, helper }) => {
    const conditionResources: Resource[] = api.permission.allowedScopes.filter(
      (r) => 'condition' in r
    ) as any;
    for (const resource of conditionResources) {
      if (resource.condition) {
        const relatedResource = helper.getRelatedResourceInstance(resource);
        const isValid = resource.condition(request, relatedResource);
        if (isValid) {
          return true;
        }
      }
    }
    return false;
  },
  ({ api, request, helper }) => {
    const user = request.$user;
    if (user) {
      const resource = helper.getResourceInstance();
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
        return helper.hasPermission(user.id, api.permission.name, scopes);
      }
    }
    return false;
  },
];

export const authorize = (args: AuthorizationArgs) => {
  if (args.api?.permission) {
    for (const middleware of middlewares) {
      if (middleware(args as any)) {
        return true;
      }
    }
    return false;
  }
  return true;
};
