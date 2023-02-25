import { Api, ForbiddenException, Permission } from '@roxavn/core/base';
import { MiddlewareContext } from '@roxavn/core/server';
import { ArrayContains, In } from 'typeorm';
import { constants, Resources, Scopes } from '../base';
import { UserRole } from './entities';

export type AuthenticatedData = {
  $user: { id: string };
  $accessToken: { id: string };
  $getResource: () => Promise<Record<string, any> | null>;
};

export const authorizeMiddlewares: Array<{
  apiMatcher: RegExp;
  handler: (
    api: Api & { permission: Permission },
    context: MiddlewareContext
  ) => Promise<boolean>;
}> = [];

// check in admin pages
authorizeMiddlewares.push({
  apiMatcher: /./,
  handler: async (api, { dbSession, resp, req }) => {
    const user: AuthenticatedData['$user'] = resp.locals.$user;
    const scopeHeader = req.get(constants.AUTH_SCOPE_HTTP_HEADER);
    if (scopeHeader === constants.ADMIN_AUTH_SCOPE) {
      const allow = await dbSession.getRepository(UserRole).count({
        where: {
          userId: user.id,
          role: {
            hasId: false,
            scope: In(
              api.permission.allowedScopes
                .filter((s) => !s.idParam)
                .map((s) =>
                  s.dynamicName ? s.dynamicName(resp.locals) : s.name
                )
            ),
            permissions: ArrayContains([api.permission.value]),
          },
        },
      });
      if (!allow) {
        throw new ForbiddenException();
      }
      return true;
    }
    return false;
  },
});

// check is owner
authorizeMiddlewares.push({
  apiMatcher: /./,
  handler: async (api, { resp }) => {
    const data: AuthenticatedData = resp.locals as any;
    const hasOwner = !!api.permission.allowedScopes.find(
      (r) => r.name === Scopes.Owner.name
    );
    if (hasOwner) {
      if (resp.locals[Resources.User.idParam] === data.$user.id) {
        return true;
      }
      const resource = await data.$getResource();
      if (resource && resource[Resources.User.idParam] === data.$user.id) {
        return true;
      }
    }
    return false;
  },
});

// check in resource scope
authorizeMiddlewares.push({
  apiMatcher: /./,
  handler: async (api, { dbSession, resp }) => {
    const data: AuthenticatedData = resp.locals as any;
    const resource = await data.$getResource();
    const scopes = api.permission.allowedScopes
      .map((s) => ({
        name: s.name,
        id:
          s.idParam &&
          (resp.locals[s.idParam] || (resource && resource[s.idParam])),
      }))
      .filter((s) => s.id);

    const allow = await dbSession.getRepository(UserRole).count({
      where: scopes.map((scope) => ({
        userId: data.$user.id,
        scopeId: scope.id,
        role: {
          hasId: true,
          scope: scope.name,
          permissions: ArrayContains([api.permission.value]),
        },
      })),
    });
    return !!allow;
  },
});
