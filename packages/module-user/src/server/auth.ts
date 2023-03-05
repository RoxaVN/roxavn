import {
  accessManager,
  Api,
  ForbiddenException,
  Permission,
} from '@roxavn/core/base';
import { AuthenticatedData, MiddlewareContext } from '@roxavn/core/server';
import { ArrayContains, In } from 'typeorm';
import { constants, scopes } from '../base';
import { UserRole } from './entities';

export const authorizeMiddlewares: Array<{
  apiMatcher: RegExp;
  handler: (
    api: Api & { permission: Permission },
    context: MiddlewareContext
  ) => Promise<boolean>;
}> = [];

// check is auth user
authorizeMiddlewares.push({
  apiMatcher: /./,
  handler: async (api) => {
    const hasScope = !!api.permission.allowedScopes.find(
      (r) => r.name === accessManager.scopes.AuthUser.name
    );
    return hasScope;
  },
});

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
            permissions: ArrayContains([api.permission.name]),
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
      (r) => r.name === accessManager.scopes.Owner.name
    );
    if (hasOwner) {
      if (resp.locals[scopes.User.idParam] === data.$user.id) {
        return true;
      }
      const resource = await data.$getResource();
      if (resource && resource[scopes.User.idParam] === data.$user.id) {
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

    if (scopes.length < 1) {
      return false;
    }

    const allow = await dbSession.getRepository(UserRole).count({
      where: scopes.map((scope) => ({
        userId: data.$user.id,
        scopeId: scope.id,
        role: {
          hasId: true,
          scope: scope.name,
          permissions: ArrayContains([api.permission.name]),
        },
      })),
    });
    return !!allow;
  },
});
