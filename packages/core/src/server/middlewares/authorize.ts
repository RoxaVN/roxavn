import { uniqBy } from 'lodash-es';
import { Permission, Resource } from '../../base/access.js';
import { Api } from '../../base/api.js';

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

const middlewares: Array<AuthorizationMiddleware> = [
  async ({ api, request, helper }) => {
    const conditionResources: Resource[] = api.permission.allowedScopes.filter(
      (r) => 'condition' in r
    ) as any;
    for (const resource of conditionResources) {
      if (resource.condition) {
        const relatedResource = await helper.getRelatedResourceInstance(
          resource
        );
        const isValid = resource.condition(request, relatedResource);
        if (isValid) {
          return true;
        }
      }
    }
    return false;
  },
  async ({ api, request, helper }) => {
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
];

export const authorize = async (args: AuthorizationArgs) => {
  if (args.api?.permission) {
    for (const middleware of middlewares) {
      if (await middleware(args as any)) {
        return true;
      }
    }
    return false;
  }
  return true;
};
